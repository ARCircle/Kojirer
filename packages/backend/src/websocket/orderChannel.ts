// TODO: テスト
import { logger } from '@/utils/logger';
import typia from 'typia';
import { WebSocket, WebSocketServer, ServerOptions } from 'ws';
import { Order, OrderStateMessage, RequestNotificationMessage } from './messages';
import { typiaValidationErrorMessage } from '@/utils/errorMessage';

export interface OrderChannel {
  notifyActiveOrderState: (currentState: Order[]) => void;
}

export type WebSocketOrderChannelConfig = {
  /**
   * WebSocketサーバーのオプション
   */
  wssConfig: ServerOptions;
};

type OrderNotificationState = {
  notify: boolean;
  include: boolean;
};

export class WebSocketOrderChannel implements OrderChannel {
  private readonly wss: WebSocketServer;

  readonly config: WebSocketOrderChannelConfig;
  private static readonly defaultConfig: WebSocketOrderChannelConfig = {
    wssConfig: {},
  };

  /**
   * WebSocket接続ごとに通知するかどうかを管理するマップ
   */
  private notificationStates: WeakMap<WebSocket, OrderNotificationState> = new WeakMap();

  constructor(config: WebSocketOrderChannelConfig) {
    this.config = { ...WebSocketOrderChannel.defaultConfig, ...config };
    logger.debug('WebSocketOrderChannel initialized with config', { data: this.config });

    this.wss = new WebSocketServer(this.config.wssConfig);

    this.wss.on('connection', (ws: WebSocket) => {
      logger.debug('New WebSocket connection established');
      ws.on('message', (message: string) => {
        logger.debug(`Received WebSocket message: ${message}`);

        const parsed = typia.json.validateParse<RequestNotificationMessage>(message);

        if (!parsed.success) {
          logger.warn('Invalid WebSocket message', { data: parsed.data });
          logger.debug(typiaValidationErrorMessage(parsed.errors));
        } else {
          logger.debug('Parsed WebSocket message', { data: parsed.data });
          this.onRequestActiveOrderStateNotification(ws, parsed.data);
        }
      });

      ws.on('close', () => {
        logger.debug('WebSocket connection closed');
        this.notificationStates.delete(ws);
      });

      ws.on('error', (error: Error) => {
        logger.warning('Error with WebSocket connection', { error });
        this.notificationStates.delete(ws);
      });
    });

    this.wss.on('error', (error: Error) => {
      logger.error('Error with WebSocket server', { error });
    });
  }

  // 一旦messagesのOrderにしているがDomainTypeにすべきではある
  /**
   * Orderの状態を購読しているクライアントに通知する
   * @param currentState 通知するOrderの状態
   */
  notifyActiveOrderState(currentState: Order[]): void {
    const orderStateMessage: OrderStateMessage = {
      type: 'state',
      data: {
        orders: currentState,
      },
    };

    logger.debug('Sending WebSocket message', { data: orderStateMessage });
    [...this.wss.clients]
      .filter((client: WebSocket) => client.readyState === WebSocket.OPEN && this.notificationStates.get(client))
      .forEach((client: WebSocket) => client.send(JSON.stringify(orderStateMessage)));
  }

  /**
   * 特定のコネクションに対して通知を有効にする
   * @param ws - WebSocket接続
   * @param include - 依存データ（Donの状態）を含めるかどうか
   */
  private requestActiveOrderStateNotification(ws: WebSocket, include: boolean): void {
    this.notificationStates.set(ws, { notify: true, include });
  }

  /**
   * Orderの状態取得リクエストを受け取った時の処理
   * @param ws - WebSocket接続
   */
  private onRequestActiveOrderStateNotification(ws: WebSocket, request: RequestNotificationMessage): void {
    this.requestActiveOrderStateNotification(ws, request.data.include);

    // TODO: ActiveなOrderの状態を取得する処理を呼び出す
    // TODO: Orderなのでincludeを見る必要がある
    const exampleOrderState: Order[] = [
      { id: '1', call_num: 1, state: 'ordered' },
      { id: '2', call_num: 2, state: 'ready' },
    ];
    this.notifyActiveOrderState(exampleOrderState);
  }
}
