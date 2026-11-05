/**
 * Create an x402-enabled API client
 *
 * @param {Object} config - Configuration options
 * @param {string} config.apiUrl - Base URL for nanomind-x API
 * @param {string} config.privateKey - Wallet private key for payments (0x prefixed)
 * @param {string} config.sessionCookie - X/Twitter session cookie (optional)
 * @param {string} config.network - Preferred network ('base-sepolia', 'base', 'ethereum', 'arbitrum')
 * @param {boolean} config.autoSelectNetwork - Auto-select cheapest network from options (default: true)
 * @param {number} config.maxPriceUsd - Refuse to sign a single payment above this many USD.
 *   Defaults to X402_MAX_PRICE_USD, or $1.00. The amount in a 402 is chosen by the
 *   server being called, so without a ceiling an agent signs whatever it is asked for.
 * @param {number} config.maxTotalUsd - Refuse once this much has been paid in this
 *   session. Defaults to X402_MAX_TOTAL_USD, or $10.00.
 * @param {string[]} config.allowedPayees - If set, only pay these addresses.
 */
export function createX402Client(config: {
    apiUrl: string;
    privateKey: string;
    sessionCookie: string;
    network: string;
    autoSelectNetwork: boolean;
    maxPriceUsd: number;
    maxTotalUsd: number;
    allowedPayees: string[];
}): Promise<{
    execute: (toolName: any, args: any) => Promise<any>;
    getBalance: () => Promise<{
        error: string;
        address?: undefined;
        network?: undefined;
        networkName?: undefined;
        chainId?: undefined;
        usdcContract?: undefined;
        autoSelectNetwork?: undefined;
        supportedNetworks?: undefined;
        note?: undefined;
    } | {
        address: any;
        network: string;
        networkName: any;
        chainId: any;
        usdcContract: any;
        autoSelectNetwork: boolean;
        supportedNetworks: {
            name: string;
            displayName: string;
            chainId: number;
            networkId: string;
            recommended: any;
            testnet: any;
            gasCost: string;
        }[];
        note: string;
        error?: undefined;
    }>;
    wallet: any;
    account: any;
    network: string;
    networkConfig: any;
    supportedNetworks: {
        'base-sepolia': {
            chainId: number;
            networkId: string;
            usdc: string;
            name: string;
            testnet: boolean;
            gasCost: string;
        };
        base: {
            chainId: number;
            networkId: string;
            usdc: string;
            name: string;
            recommended: boolean;
            gasCost: string;
        };
        ethereum: {
            chainId: number;
            networkId: string;
            usdc: string;
            name: string;
            gasCost: string;
        };
        arbitrum: {
            chainId: number;
            networkId: string;
            usdc: string;
            name: string;
            gasCost: string;
        };
    };
    autoSelectNetwork: boolean;
}>;
/**
 * Helper to check if an error is a payment error
 */
export function isPaymentError(error: any): boolean;
/**
 * Format payment error for user display
 */
export function formatPaymentError(error: any): {
    error: string;
    message: any;
    price: any;
    network: any;
    hint: string;
    faucet: string;
    supportedNetworks: string[];
} | {
    error: string;
    message: any;
    hint: string;
    supportedNetworks: string[];
    price?: undefined;
    network?: undefined;
    faucet?: undefined;
} | {
    error: any;
    message?: undefined;
    price?: undefined;
    network?: undefined;
    hint?: undefined;
    faucet?: undefined;
    supportedNetworks?: undefined;
};
export const NETWORK_CONFIGS: {
    'base-sepolia': {
        chainId: number;
        networkId: string;
        usdc: string;
        name: string;
        testnet: boolean;
        gasCost: string;
    };
    base: {
        chainId: number;
        networkId: string;
        usdc: string;
        name: string;
        recommended: boolean;
        gasCost: string;
    };
    ethereum: {
        chainId: number;
        networkId: string;
        usdc: string;
        name: string;
        gasCost: string;
    };
    arbitrum: {
        chainId: number;
        networkId: string;
        usdc: string;
        name: string;
        gasCost: string;
    };
};
declare namespace _default {
    export { createX402Client };
    export { isPaymentError };
    export { formatPaymentError };
    export { NETWORK_CONFIGS };
}
export default _default;
