import { MintAuthorizationResponse } from "@/types/mintNFT";

export const isWalletMatched = (
    address?: string,
    wallet?: string,
) => {
    if (!address || !wallet) return false;

    return (
        address.toLowerCase() ===
        wallet.toLowerCase()
    );
};

export const isRequirementMet = (
    current: number,
    required: number,
) => current >= required;

export const isAuthorizationValid = (
    authorization: MintAuthorizationResponse | null,
    expiredAt: number,
): authorization is MintAuthorizationResponse => {
    if (!authorization) return false;

    return Date.now() < expiredAt;
};

interface GetMintAuthorizationParams {
    wallet: string;

    authorization: MintAuthorizationResponse | null;

    authorizationExpiredAt: number;

    authorizeMint: (params: {
        wallet: string;
    }) => Promise<MintAuthorizationResponse>;

    setAuthorization: (
        value: MintAuthorizationResponse | null,
    ) => void;

    setAuthorizationExpiredAt: (
        value: number,
    ) => void;
}

export const getMintAuthorization = async ({
    wallet,
    authorization,
    authorizationExpiredAt,
    authorizeMint,
    setAuthorization,
    setAuthorizationExpiredAt,
}: GetMintAuthorizationParams): Promise<MintAuthorizationResponse> => {
    if (
        isAuthorizationValid(
            authorization,
            authorizationExpiredAt,
        )
    ) {
        return authorization;
    }

    const result = await authorizeMint({
        wallet,
    });

    setAuthorization(result);

    const expiresIn =
        result.nft.mint.authorization.expires_in_sec;

    setAuthorizationExpiredAt(
        Date.now() + expiresIn * 1000,
    );

    return result;
};