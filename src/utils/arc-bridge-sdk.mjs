
import { Contract, Interface, JsonRpcProvider, MaxUint256, getAddress, zeroPadValue, formatUnits } from "ethers";

/** @type {const} */
export const ARC_BRIDGE = {
  baseChainId: 8453,
  arcChainId: 5042,
  baseDomain: 6,
  arcDomain: 26,
  usdcBase: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  usdcArc: "0x3600000000000000000000000000000000000000",
  tokenMessengerBase: "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d",
  messageTransmitterArc: "0x81d40f21f12a8f0e3252bccb954d722d4c464b64",
  forwardingHookData:
    "0x636374702d666f72776172640000000000000000000000000000000000000000",
  minFinality: 2000,
  pollMax: 600,
  pollMs: 6000,
};

export const DEFAULT_CONFIG = {
  baseRpc: "https://mainnet.base.org",
  arcRpc: "https://5042.rpc.thirdweb.com",
  irisBase: "https://iris-api.circle.com",
  minFinality: ARC_BRIDGE.minFinality,
  pollMax: ARC_BRIDGE.pollMax,
  pollMs: ARC_BRIDGE.pollMs,
};

const TM_ABI = [
  "function localMinter() view returns (address)",
  "function depositForBurnWithHook(uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken, bytes32 destinationCaller, uint256 maxFee, uint32 minFinalityThreshold, bytes hookData)",
];
const MINTER_ABI = ["function burnLimitsPerMessage(address) view returns (uint256)"];
const USDC_ABI = [
  "function minterAllowance(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

const TRANSMITTER_ABI = [
  "function receiveMessage(bytes message, bytes attestation) returns (bool)",
  "function isNonceUsed(uint32 sourceDomain, uint64 nonce) view returns (bool)",
];

const tmIface = new Interface(TM_ABI);
const usdcIface = new Interface(USDC_ABI);
const transmitterIface = new Interface(TRANSMITTER_ABI);

function usdc6ToNumber(raw) {
  return Number(formatUnits(raw, 6));
}

function parseAmountUsdc(input) {
  const n = Number(String(input).replace(/,/g, ""));
  if (!Number.isFinite(n) || n < 0) throw new Error("Invalid amount");
  return n;
}

function addrToBytes32(addr) {
  return zeroPadValue(getAddress(addr), 32);
}

function sleepMs(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function mergeConfig(config = {}) {
  return { ...DEFAULT_CONFIG, ...config };
}

export async function fetchIrisFees(irisBase, forward = true) {
  const q = forward ? "?forward=true" : "";
  const url = `${irisBase.replace(/\/$/, "")}/v2/burn/USDC/fees/${ARC_BRIDGE.baseDomain}/${ARC_BRIDGE.arcDomain}${q}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`Iris fees ${res.status}: ${text.slice(0, 200)}`);
  return JSON.parse(text);
}

export function pickFeeTier(fees, finality) {
  const tier = fees.find((f) => f.finalityThreshold === finality) || fees[0];
  if (!tier) throw new Error("No fee tier");
  return tier;
}

export function calcForwardFees(amountUsdc, feeTier) {
  const transferRaw = BigInt(Math.round(amountUsdc * 1_000_000));
  const forwardFee = BigInt(feeTier.forwardFee?.med ?? feeTier.forwardFee?.low ?? 0);
  const protocolFee =
    (transferRaw * BigInt(Math.round((feeTier.minimumFee || 0) * 100))) / 1_000_000n;
  const maxFee = forwardFee + protocolFee;
  const totalBurnRaw = transferRaw + maxFee;
  return {
    receiveUsdc: amountUsdc,
    forwardFeeUsdc: usdc6ToNumber(forwardFee),
    networkFeeUsdc: usdc6ToNumber(maxFee),
    totalBurnUsdc: usdc6ToNumber(totalBurnRaw),
    totalBurnRaw: totalBurnRaw.toString(),
    maxFeeRaw: maxFee.toString(),
  };
}

export async function getMinterCap(config = {}) {
  const { arcRpc } = mergeConfig(config);
  const provider = new JsonRpcProvider(arcRpc, ARC_BRIDGE.arcChainId);
  const tm = new Contract(ARC_BRIDGE.tokenMessengerBase, TM_ABI, provider);
  const localMinter = await tm.localMinter();
  const minter = new Contract(localMinter, MINTER_ABI, provider);
  const usdc = new Contract(ARC_BRIDGE.usdcArc, USDC_ABI, provider);

  const [allowance, perMessage] = await Promise.all([
    usdc.minterAllowance(localMinter),
    minter.burnLimitsPerMessage(ARC_BRIDGE.usdcArc),
  ]);
  provider.destroy();

  const displayUsdc = usdc6ToNumber(allowance);
  const perMessageUsdc = usdc6ToNumber(perMessage);
  return {
    circleMinterCap: {
      displayUsdc,
      perMessageUsdc,
      maxSingleBridgeUsdc: Math.min(displayUsdc, perMessageUsdc),
    },
    tokenMinter: localMinter,
  };
}

export async function getForwardQuote(amountUsdc, config = {}) {
  const cfg = mergeConfig(config);
  const amount = parseAmountUsdc(amountUsdc);
  const [fees, cap] = await Promise.all([
    fetchIrisFees(cfg.irisBase, true),
    getMinterCap(cfg),
  ]);
  const tier = pickFeeTier(fees, cfg.minFinality);
  const feeBreakdown = calcForwardFees(amount, tier);
  const max = cap.circleMinterCap.maxSingleBridgeUsdc;
  return {
    ...feeBreakdown,
    circleMinterCap: cap.circleMinterCap,
    canBridge: amount > 0 && amount <= max,
    blockReason: amount > max ? `Exceeded the mint cap (max ${max} USDC)` : null,
    estimatedMinutes: 15,
  };
}

async function fetchIrisMessage(irisBase, burnTxHash) {
  const url = `${irisBase.replace(/\/$/, "")}/v2/messages/${ARC_BRIDGE.baseDomain}?transactionHash=${burnTxHash}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (res.status === 404) {
    return { found: false, status: "pending", forwardTxHash: null, attestationReady: false };
  }
  if (!res.ok) throw new Error(`Iris ${res.status}: ${text.slice(0, 200)}`);

  const originalJson = JSON.parse(text);
  const m = originalJson.messages?.[0];
  if (!m) return { found: false, status: "pending", forwardTxHash: null, attestationReady: false };

  const att = m.attestation;
  const attReady =
    att && att !== "PENDING" && typeof att === "string" && att.startsWith("0x") && att.length > 10;
  return {
    found: true,
    status: m.status || "unknown",
    forwardTxHash: m.forwardTxHash || null,
    attestationReady: attReady && m.status === "complete",
    amountUsdc: m.decodedMessage?.decodedMessageBody?.amount
      ? usdc6ToNumber(BigInt(m.decodedMessage.decodedMessageBody.amount))
      : null,
    rawMessage: m.message || null,
    rawAttestation: att || null,
    nonce: m.nonce || null,
  };
}

export function buildPending(pollIndex, pollMax, iris) {
  const i = Math.max(0, Number(pollIndex) || 0);
  const max = Math.max(1, Number(pollMax) || ARC_BRIDGE.pollMax);
  const forwarded = Boolean(iris?.forwardTxHash);
  return {
    pendingLabel: `${i}/${max}`,
    pollIndex: i,
    pollMax: max,
    irisStatus: iris?.status || "pending",
    forwardTxHash: iris?.forwardTxHash || null,
    done: forwarded,
    nextAction: forwarded
      ? "done"
      : iris?.attestationReady
        ? "manual_mint"
        : iris?.status === "pending_confirmations"
          ? "wait_confirmations"
          : "wait_iris",
  };
}

export async function fetchBridgeStatus(burnTxHash, config = {}) {
  const cfg = mergeConfig(config);
  const hash = String(burnTxHash || "").trim();
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) throw new Error("Invalid burnTxHash");
  const iris = await fetchIrisMessage(cfg.irisBase, hash);
  const pending = buildPending(config.poll ?? config.pollIndex ?? 0, config.pollMax, iris);
  return { burnTxHash: hash, iris, pending };
}

export async function waitRelay(burnTxHash, config = {}) {
  const cfg = mergeConfig(config);
  const hash = String(burnTxHash || "").trim();
  if (!/^0x[a-fA-F0-9]{64}$/.test(hash)) throw new Error("Invalid burnTxHash");

  const pollMax = Number(config.pollMax ?? cfg.pollMax);
  const pollMs = Number(config.pollMs ?? cfg.pollMs);

  for (let i = 1; i <= pollMax; i++) {
    const { iris, pending } = await fetchBridgeStatus(hash, { ...cfg, poll: i, pollMax });

    if (config.onPoll) await config.onPoll({ pollIndex: i, pollMax, iris, pending });

    if (iris.forwardTxHash) {
      return { status: "relayed", burnTxHash: hash, forwardTxHash: iris.forwardTxHash, pending };
    }
    if (iris.attestationReady && !iris.forwardTxHash) {
      return {
        status: "manual_mint_required",
        burnTxHash: hash,
        pending,
        message: "Circle doesn't relay — needs receiveMessage on Arc",
      };
    }
    if (i < pollMax) await sleepMs(pollMs);
  }
  return { status: "timeout", burnTxHash: hash };
}

export function buildApproveUsdcTx({ spender, amountRaw } = {}) {
  const data = usdcIface.encodeFunctionData("approve", [
    spender || ARC_BRIDGE.tokenMessengerBase,
    amountRaw != null ? BigInt(amountRaw) : MaxUint256,
  ]);
  return { to: ARC_BRIDGE.usdcBase, data, value: 0n };
}

// export async function buildBurnWithHookTx({ recipient, amountUsdc }, config = {}) {
//   const cfg = mergeConfig(config);
//   const quote = await getForwardQuote(amountUsdc, cfg);
//   if (!quote.canBridge) throw new Error(quote.blockReason || "Cannot bridge.");

//   const data = tmIface.encodeFunctionData("depositForBurnWithHook", [
//     BigInt(quote.totalBurnRaw),
//     ARC_BRIDGE.arcDomain,
//     addrToBytes32(recipient),
//     ARC_BRIDGE.usdcBase,
//     "0x0000000000000000000000000000000000000000000000000000000000000000",
//     BigInt(quote.maxFeeRaw),
//     cfg.minFinality,
//     ARC_BRIDGE.forwardingHookData,
//   ]);

//   return {
//     to: ARC_BRIDGE.tokenMessengerBase,
//     data,
//     value: 0n,
//     chainId: ARC_BRIDGE.baseChainId,
//     quote,
//   };
// }

export async function buildBurnWithHookTx({ recipient, amountUsdc }, config = {}) {
  const cfg = mergeConfig(config);
  const quote = await getForwardQuote(amountUsdc, cfg);
  if (!quote.canBridge) throw new Error(quote.blockReason || "Cannot bridge.");

  const amountParsed = parseAmountUsdc(amountUsdc);
  const amountRaw = BigInt(Math.round(amountParsed * 1_000_000));

  const data = tmIface.encodeFunctionData("depositForBurnWithHook", [
    amountRaw,
    ARC_BRIDGE.arcDomain,
    addrToBytes32(recipient),
    ARC_BRIDGE.usdcBase,
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    BigInt(quote.maxFeeRaw),
    cfg.minFinality,
    ARC_BRIDGE.forwardingHookData,
  ]);

  return {
    to: ARC_BRIDGE.tokenMessengerBase,
    data,
    value: 0n,
    chainId: ARC_BRIDGE.baseChainId,
    quote,
  };
}

export async function getUsdcAllowance(owner, config = {}) {
  const { baseRpc } = mergeConfig(config);
  const provider = new JsonRpcProvider(baseRpc, ARC_BRIDGE.baseChainId);
  const usdc = new Contract(ARC_BRIDGE.usdcBase, USDC_ABI, provider);
  const allowance = await usdc.allowance(owner, ARC_BRIDGE.tokenMessengerBase);
  provider.destroy();
  return allowance;
}




export async function getBatchManualMintStatus(burnTxHashes, { recipient }, config = {}) {
  const cfg = mergeConfig(config);
  if (!burnTxHashes || burnTxHashes.length === 0) return [];

  const irisResults = await Promise.all(
    burnTxHashes.map(async (hash) => {
      try {
        return { hash, data: await fetchIrisMessage(cfg.irisBase, hash) };
      } catch (e) {
        console.error(`Fetch Iris failed for ${hash}:`, e);
        return { hash, data: { found: false, status: "error" } };
      }
    })
  );

  const provider = new JsonRpcProvider(cfg.arcRpc, ARC_BRIDGE.arcChainId);
  const transmitter = new Contract(ARC_BRIDGE.messageTransmitterArc, TRANSMITTER_ABI, provider);
  const tm = new Contract(ARC_BRIDGE.tokenMessengerBase, TM_ABI, provider);

  try {
    const [arcGasBalance, localMinter] = await Promise.all([
      provider.getBalance(getAddress(recipient)),
      tm.localMinter()
    ]);

    const minter = new Contract(localMinter, MINTER_ABI, provider);
    const usdc = new Contract(ARC_BRIDGE.usdcArc, USDC_ABI, provider);

    const [allowance, perMessage] = await Promise.all([
      usdc.minterAllowance(localMinter),
      minter.burnLimitsPerMessage(ARC_BRIDGE.usdcArc),
    ]);

    const arcGasBalanceUsdc = usdc6ToNumber(arcGasBalance);
    const estimatedGasUsdc = 0.005;
    const currentMinterAllowance = usdc6ToNumber(allowance);

    const nonceChecks = await Promise.all(
      irisResults.map(async (item) => {
        if (item.data.found && item.data.attestationReady && !item.data.forwardTxHash && item.data.nonce != null) {
          try {
            const isUsed = await transmitter.isNonceUsed(ARC_BRIDGE.baseDomain, BigInt(item.data.nonce));
            return { hash: item.hash, isNonceUsed: isUsed };
          } catch (e) {
            return { hash: item.hash, isNonceUsed: false };
          }
        }
        return { hash: item.hash, isNonceUsed: false };
      })
    );

    provider.destroy();

    const nonceMap = {};
    nonceChecks.forEach(nc => { nonceMap[nc.hash] = nc.isNonceUsed; });

    return irisResults.map((item) => {
      const hash = item.hash;
      const iris = item.data;

      if (!iris.found || !iris.attestationReady) {
        return {
          hash,
          phase: "waiting_attestation",
          showMintButton: false,
          canMint: false,
          blockReason: "waiting_attestation",
          blockReasonLabel: "Waiting for the authentication network (Attestation)",
          mintAmountUsdc: iris.amountUsdc,
          arcGasBalanceUsdc,
          estimatedGasUsdc,
        };
      }

      const isNonceUsed = nonceMap[hash] || false;
      if (iris.forwardTxHash || isNonceUsed) {
        return {
          hash,
          phase: "relay_done",
          showMintButton: false,
          canMint: false,
          blockReason: "already_relayed",
          blockReasonLabel: "The minting transaction has been successfully completed.",
          mintAmountUsdc: iris.amountUsdc,
          arcGasBalanceUsdc,
          estimatedGasUsdc,
        };
      }

      let blockReason = null;
      let blockReasonLabel = null;
      let canMint = true;

      if (iris.amountUsdc && currentMinterAllowance < iris.amountUsdc) {
        canMint = false;
        blockReason = "minter_cap";
        blockReasonLabel = "Minter capacity limit reached. Waiting for liquidity pool refill";
      } else if (arcGasBalanceUsdc < estimatedGasUsdc) {
        canMint = false;
        blockReason = "insufficient_gas";
        blockReasonLabel = "There aren't enough USDC to cover the Gas fees for execution on the Arc network.";
      }

      return {
        hash,
        phase: "manual_mint_ready",
        showMintButton: true,
        canMint,
        blockReason,
        blockReasonLabel,
        mintAmountUsdc: iris.amountUsdc,
        arcGasBalanceUsdc,
        estimatedGasUsdc,
      };
    });

  } catch (error) {
    console.error("Batch RPC request error:", error);
    provider.destroy();
    throw error;
  }
}

export async function buildManualMintTx(burnTxHash, { recipient }, config = {}) {
  const cfg = mergeConfig(config);
  const hash = String(burnTxHash || "").trim();

  const iris = await fetchIrisMessage(cfg.irisBase, hash);

  if (!iris.found || !iris.rawMessage || !iris.rawAttestation) {
    throw new Error("Message or Attestation data is not ready on Circle Iris API yet.");
  }

  const data = transmitterIface.encodeFunctionData("receiveMessage", [
    iris.rawMessage,
    iris.rawAttestation
  ]);

  return {
    to: ARC_BRIDGE.messageTransmitterArc,
    data,
    value: 0n,
    chainId: ARC_BRIDGE.arcChainId,
    gasLimit: 350000n,
  };
}