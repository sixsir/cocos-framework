export type GameSocketOptions = {
    url: string;
    protocols?: string | string[];
    reconnectInterval?: number; // 重连间隔（毫秒）
    maxReconnectAttempts?: number; // 最大重连次数
    heartbeatInterval?: number; // 心跳间隔（毫秒）
    heartbeatData?: string | ArrayBufferLike | Blob | ArrayBufferView; // 心跳包数据
};

export class GameSocket {
    private ws: WebSocket | null = null;
    private options: GameSocketOptions;
    private reconnectAttempts = 0;
    private isManuallyClosed = false;
    private heartbeatTimer: any = null;

    // 事件回调
    public onOpen?: () => void;
    public onClose?: (event: CloseEvent) => void;
    public onError?: (event: Event) => void;
    public onMessage?: (data: any) => void;

    constructor(options: GameSocketOptions) {
        this.options = options;
    }

    public connect() {
        this.isManuallyClosed = false;
        this.ws = new WebSocket(this.options.url, this.options.protocols);
        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.onOpen && this.onOpen();
        };
        this.ws.onclose = (event) => {
            this.stopHeartbeat();
            this.ws = null;
            this.onClose && this.onClose(event);
            if (!this.isManuallyClosed) {
                this.tryReconnect();
            }
        };
        this.ws.onerror = (event) => {
            this.onError && this.onError(event);
        };
        this.ws.onmessage = (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                data = event.data;
            }
            this.onMessage?.(data);
        };
    }

    public send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(data);
        }
    }

    public close() {
        this.isManuallyClosed = true;
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    private tryReconnect() {
        const { reconnectInterval = 2000, maxReconnectAttempts = 5 } = this.options;
        if (this.reconnectAttempts < maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, reconnectInterval);
        }
    }

    public isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    private startHeartbeat() {
        this.stopHeartbeat();
        const { heartbeatInterval = 5000, heartbeatData = 'ping' } = this.options;
        if (heartbeatInterval > 0) {
            this.heartbeatTimer = setInterval(() => {
                this.send(heartbeatData);
            }, heartbeatInterval);
        }
    }

    private stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
}