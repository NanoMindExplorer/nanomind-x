export function getNotifier(): Promise<any>;
export class Notifier {
    config: {
        email: {
            enabled: boolean;
        };
        slack: {
            enabled: boolean;
        };
        discord: {
            enabled: boolean;
        };
        telegram: {
            enabled: boolean;
        };
        webhook: {
            enabled: boolean;
        };
    };
    /**
     * Configure notification channels
     */
    configure(config: any): {
        status: string;
        channels: string[];
    };
    /**
     * Load config from disk
     */
    load(): Promise<this>;
    /**
     * Send notification to all enabled channels
     */
    send(event: any): Promise<{
        email: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        slack: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        discord: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        telegram: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        webhook: {
            error: string;
            channel?: undefined;
            deliveryId?: undefined;
            status?: undefined;
            signed?: undefined;
        } | {
            error: string;
            channel: string;
            deliveryId: string;
            status?: undefined;
            signed?: undefined;
        } | {
            status: string;
            channel: string;
            deliveryId: string;
            signed: boolean;
            error?: undefined;
        };
    }>;
    /**
     * Send to a specific channel
     */
    sendTo(channel: any, event: any): Promise<{
        email: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        slack: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        discord: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        telegram: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        webhook: {
            error: string;
            channel?: undefined;
            deliveryId?: undefined;
            status?: undefined;
            signed?: undefined;
        } | {
            error: string;
            channel: string;
            deliveryId: string;
            status?: undefined;
            signed?: undefined;
        } | {
            status: string;
            channel: string;
            deliveryId: string;
            signed: boolean;
            error?: undefined;
        };
    } | {
        error: string;
    }>;
    /**
     * Send test notification
     */
    test(channel: any): Promise<{
        email: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        slack: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        discord: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        telegram: {
            error: string;
            status?: undefined;
            channel?: undefined;
        } | {
            status: string;
            channel: string;
            error?: undefined;
        };
        webhook: {
            error: string;
            channel?: undefined;
            deliveryId?: undefined;
            status?: undefined;
            signed?: undefined;
        } | {
            error: string;
            channel: string;
            deliveryId: string;
            status?: undefined;
            signed?: undefined;
        } | {
            status: string;
            channel: string;
            deliveryId: string;
            signed: boolean;
            error?: undefined;
        };
    } | {
        error: string;
    }>;
    _sendEmail(config: any, event: any): Promise<{
        error: string;
        status?: undefined;
        channel?: undefined;
    } | {
        status: string;
        channel: string;
        error?: undefined;
    }>;
    _sendSlack(config: any, event: any): Promise<{
        error: string;
        status?: undefined;
        channel?: undefined;
    } | {
        status: string;
        channel: string;
        error?: undefined;
    }>;
    _sendDiscord(config: any, event: any): Promise<{
        error: string;
        status?: undefined;
        channel?: undefined;
    } | {
        status: string;
        channel: string;
        error?: undefined;
    }>;
    _sendTelegram(config: any, event: any): Promise<{
        error: string;
        status?: undefined;
        channel?: undefined;
    } | {
        status: string;
        channel: string;
        error?: undefined;
    }>;
    /**
     * Generic signed webhook. Config: `{ enabled, url, secret?, headers? }`.
     * The secret falls back to NANOMIND_X_WEBHOOK_SECRET. Delivery, retries,
     * signing, and the delivery log live in ./webhook.js.
     */
    _sendWebhook(config: any, event: any): Promise<{
        error: string;
        channel?: undefined;
        deliveryId?: undefined;
        status?: undefined;
        signed?: undefined;
    } | {
        error: string;
        channel: string;
        deliveryId: string;
        status?: undefined;
        signed?: undefined;
    } | {
        status: string;
        channel: string;
        deliveryId: string;
        signed: boolean;
        error?: undefined;
    }>;
    _saveConfig(): Promise<void>;
}
export namespace TRIGGERS {
    namespace SENTIMENT_DROP {
        let type: string;
        let title: string;
        let severity: string;
    }
    namespace FOLLOWER_LOSS {
        let type_1: string;
        export { type_1 as type };
        let title_1: string;
        export { title_1 as title };
        let severity_1: string;
        export { severity_1 as severity };
    }
    namespace BULK_COMPLETE {
        let type_2: string;
        export { type_2 as type };
        let title_2: string;
        export { title_2 as title };
        let severity_2: string;
        export { severity_2 as severity };
    }
    namespace JOB_FAILURE {
        let type_3: string;
        export { type_3 as type };
        let title_3: string;
        export { title_3 as title };
        let severity_3: string;
        export { severity_3 as severity };
    }
    namespace MILESTONE {
        let type_4: string;
        export { type_4 as type };
        let title_4: string;
        export { title_4 as title };
        let severity_4: string;
        export { severity_4 as severity };
    }
    namespace GROWTH_SPIKE {
        let type_5: string;
        export { type_5 as type };
        let title_5: string;
        export { title_5 as title };
        let severity_5: string;
        export { severity_5 as severity };
    }
    namespace KEYWORD_MATCH {
        let type_6: string;
        export { type_6 as type };
        let title_6: string;
        export { title_6 as title };
        let severity_6: string;
        export { severity_6 as severity };
    }
}
