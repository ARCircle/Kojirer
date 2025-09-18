import { logger } from '@/utils/logger';
import typia from 'typia';
import { WebSocket, WebSocketServer } from 'ws';
import { WebSocketDon, DonStateMessage, RequestNotificationMessage, donConverter } from './messages';
import { typiaValidationErrorMessage } from '@/utils/errorMessage';
import { components } from 'api/schema';

// TODO: ここにinterfaceがあるのは正しい状態ではないのでexportが必要になったら直す
interface DonChannel {
  notifyActiveDonState: (activeDons: ActiveDon[]) => void;
}

type ActiveDon = components['schemas']['ActiveDon'];

type WebSocketDonChannelProps = {
  wss: WebSocketServer;
  getActiveDons: () => Promise<ActiveDon[]>;
};

/**
 * WebSocketのDonChannelに対応するサービス
 * @method notifyActiveDonState - Donの状態を通知する
 */
export class WebSocketDonChannel implements DonChannel {
  private readonly wss: WebSocketServer;
  private readonly getActiveDons: () => Promise<ActiveDon[]>;
  /**
   * WebSocket接続ごとに通知するかどうかを管理するマップ
   */
  private notificationStates: WeakMap<WebSocket, boolean> = new WeakMap();

  constructor({ wss, getActiveDons }: WebSocketDonChannelProps) {
    this.wss = wss;
    this.getActiveDons = getActiveDons;
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

  /**
   * Donの状態を購読しているクライアントに通知する
   * @param currentState 通知するDonの状態
   */
  notifyActiveDonState(activeDons: ActiveDon[]): void {
    const donStateMessage: DonStateMessage = {
      type: 'state',
      data: {
        dons: activeDons.map((don) => donConverter.fromActiveDon(don)),
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
  private async onRequestActiveDonStateNotification(ws: WebSocket): Promise<void> {
    this.requestActiveDonStateNotification(ws);

    const activeDons = await this.getActiveDons();
    this.notifyActiveDonState(activeDons);
  }
}
