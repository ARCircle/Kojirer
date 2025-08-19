import { logger } from '@/utils/logger';
import typia from 'typia';
import { WebSocket, WebSocketServer } from 'ws';
import { Don, DonStateMessage, RequestNotificationMessage } from './messages';
import { typiaValidationErrorMessage } from '@/utils/errorMessage';

interface DonChannel {
  notifyActiveDonState: (currentState: Don[]) => void;
}

type WebSocketDonChannelProps = {
  wss: WebSocketServer;
};

/**
 * WebSocketのDonChannelに対応するサービス
 * @method notifyActiveDonState - Donの状態を通知する
 */
export class WebSocketDonChannel implements DonChannel {
  private readonly wss: WebSocketServer;

  /**
   * WebSocket接続ごとに通知するかどうかを管理するマップ
   */
  private notificationStates: WeakMap<WebSocket, boolean> = new WeakMap();

  constructor({ wss }: WebSocketDonChannelProps) {
    this.wss = wss;
    logger.debug('WebSocketDonChannel initialized');

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
          this.onRequestActiveDonStateNotification(ws);
        }
      });

      ws.on('close', () => {
        logger.debug('WebSocket connection closed');
        this.notificationStates.delete(ws);
      });

      ws.on('error', (error: Error) => {
        logger.warn('Error with WebSocket connection', { error });
        this.notificationStates.delete(ws);
      });
    });

    this.wss.on('error', (error: Error) => {
      logger.error('Error with WebSocket server', { error });
    });
  }

  // 一旦messagesのDonにしているがDomainTypeにすべきではある
  /**
   * Donの状態を購読しているクライアントに通知する
   * @param currentState 通知するDonの状態
   */
  notifyActiveDonState(currentState: Don[]): void {
    const donStateMessage: DonStateMessage = {
      type: 'state',
      data: {
        dons: currentState,
      },
    };

    logger.debug('Sending WebSocket message', { data: donStateMessage });
    [...this.wss.clients]
      .filter((client: WebSocket) => client.readyState === WebSocket.OPEN && this.notificationStates.get(client))
      .forEach((client: WebSocket) => client.send(JSON.stringify(donStateMessage)));
  }

  /**
   * 特定のコネクションに対して通知を有効にする
   * @param ws - WebSocket接続
   */
  private requestActiveDonStateNotification(ws: WebSocket): void {
    this.notificationStates.set(ws, true);
  }

  // Donなのでincludeを見る必要がない
  /**
   * Donの状態取得リクエストを受け取った時の処理
   * @param ws - WebSocket接続
   */
  private onRequestActiveDonStateNotification(ws: WebSocket): void {
    this.requestActiveDonStateNotification(ws);

    // TODO: ActiveなDonの状態を取得する処理を呼び出す
    const exampleDonState: Don[] = [
      { id: '1', state: 'ordered' },
      { id: '2', state: 'cooking' },
    ];
    this.notifyActiveDonState(exampleDonState);
  }
}
