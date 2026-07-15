import {
    FaucetConfig,
    FaucetStatus,
    OkxPrepareResponse,
    OkxSetupRequest,
    OkxSetupResponse,
    OkxStatusResponse,
    PersonalClaimRequest,
    PersonalClaimResponse,
    PersonalPrepareResponse,
} from "@/types/faucet";

import {
    FAUCET_API_BASE,
    FAUCET_ENDPOINTS,
} from "@/constants/faucet";

async function request<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(
        `${FAUCET_API_BASE}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            ...options,
        }
    );

    if (!response.ok) {
        throw new Error(await response.text());
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const FaucetService = {
    getConfig() {
        return request<FaucetConfig>(
            FAUCET_ENDPOINTS.CONFIG
        );
    },

    preparePersonal(owner: string) {
        return request<PersonalPrepareResponse>(
            `${FAUCET_ENDPOINTS.PERSONAL.PREPARE}?owner=${owner}`
        );
    },

    claimPersonal(body: PersonalClaimRequest) {
        return request<PersonalClaimResponse>(
            FAUCET_ENDPOINTS.PERSONAL.CLAIM,
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );
    },

    personalStatus(owner: string) {
        return request<FaucetStatus>(
            `${FAUCET_ENDPOINTS.PERSONAL.STATUS}?owner=${owner}`
        );
    },

    prepareOkx(owner: string) {
        return request<OkxPrepareResponse>(
            `${FAUCET_ENDPOINTS.OKX.PREPARE}?owner=${owner}`
        );
    },

    prefetchOkx(owner: string) {
        return request<void>(
            `${FAUCET_ENDPOINTS.OKX.PREFETCH}?owner=${owner}`
        );
    },

    setupOkx(body: OkxSetupRequest) {
        return request<OkxSetupResponse>(
            FAUCET_ENDPOINTS.OKX.SETUP,
            {
                method: "POST",
                body: JSON.stringify(body),
            }
        );
    },

    okxStatus(owner: string) {
        return request<OkxStatusResponse>(
            `${FAUCET_ENDPOINTS.OKX.STATUS}?owner=${owner}`
        );
    },

    syncOkx(owner: string) {
        return request<void>(
            FAUCET_ENDPOINTS.OKX.SYNC,
            {
                method: "POST",
                body: JSON.stringify({
                    owner,
                }),
            }
        );
    },

    tradeOkx(owner: string) {
        return request<void>(
            FAUCET_ENDPOINTS.OKX.TRADE,
            {
                method: "POST",
                body: JSON.stringify({
                    owner,
                }),
            }
        );
    },

    delegateStatus(owner: string) {
        return request<void>(
            `${FAUCET_ENDPOINTS.OKX.DELEGATE_STATUS}?owner=${owner}`
        );
    },
};