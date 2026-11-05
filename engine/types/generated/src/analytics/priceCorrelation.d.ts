export function fetchCoinGeckoPrices(tokenId: string, fromTs: number, toTs: number): Promise<Array<{
    ts: number;
    price: number;
}>>;
export function fetchGeckoTerminalPrices(network: string, poolAddress: string, fromTs: number, toTs: number): Promise<Array<{
    ts: number;
    price: number;
    open: number;
    high: number;
    low: number;
    close: number;
}>>;
export function alignTweetsWithPrices(tweets: Array<{
    timestamp: number;
    text: string;
    url?: string;
}>, prices: Array<{
    ts: number;
    price: number;
}>, windows?: number[]): any[];
export function computeCorrelationStats(alignedTweets: any[]): object | null;
export function analyzeTweetPriceCorrelation({ tweets, tokenId, network, poolAddress, windows, }: {
    tweets: Array<{
        timestamp: number;
        text: string;
        url?: string;
    }>;
    tokenId?: string;
    network?: string;
    poolAddress?: string;
    windows?: number[];
}): Promise<{
    aligned: any[];
    stats: object;
    meta: object;
}>;
