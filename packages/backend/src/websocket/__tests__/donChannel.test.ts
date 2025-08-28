import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WebSocketDonChannel } from '../donChannel';
import { WebSocket, WebSocketServer } from 'ws';
import { Don } from '../messages';

vi.mock('ws');
vi.mock('typia', () => ({
  default: {
    json: {
      validateParse: vi.fn(() => ({
        success: true,
        data: { type: 'request', data: { include: true } },
      })),
    },
  },
}));

describe('WebSocketDonChannel', () => {
  let mockWss: WebSocketServer;
  let donChannel: WebSocketDonChannel;

  // ヘルパー関数：mockWebSocketを作成
  const createMockWebSocket = () =>
    ({
      on: vi.fn(),
      send: vi.fn(),
      readyState: WebSocket.OPEN,
    }) as any;

  // ヘルパー関数：connectionハンドラーを取得
  const getConnectionHandler = () => {
    const calls = (mockWss.on as any).mock.calls;
    const connectionCall = calls.find((call: any[]) => call[0] === 'connection');
    return connectionCall[1];
  };

  beforeEach(() => {
    mockWss = {
      on: vi.fn(),
      clients: new Set(),
    } as any;

    donChannel = new WebSocketDonChannel({ wss: mockWss });
  });

  it('WebSocketDonChannelが初期化される', () => {
    expect(donChannel).toBeDefined();
    expect(mockWss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    expect(mockWss.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  describe('メッセージ処理', () => {
    it('正常なRequestNotificationMessageを受信して通知状態が有効になる', () => {
      const mockWs = createMockWebSocket();
      const connectionHandler = getConnectionHandler();

      // WebSocket接続をシミュレート
      connectionHandler(mockWs);

      // messageハンドラーを取得
      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      // 正常なメッセージを送信
      const validMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(validMessage);

      // 通知が有効になっていることを確認（Don状態通知でテスト）
      mockWss.clients = new Set([mockWs]);
      donChannel.notifyActiveDonState([{ id: '1', state: 'ordered' }]);

      expect(mockWs.send).toHaveBeenCalled();
    });
  });

  describe('Don状態通知', () => {
    it('通知購読中のクライアントにのみメッセージが送信される', () => {
      const subscribedWs = createMockWebSocket();
      const nonSubscribedWs = createMockWebSocket();

      // 購読済みクライアントをmockWss.clientsに追加
      mockWss.clients = new Set([subscribedWs, nonSubscribedWs]);

      // 購読状態を設定（実際のコードでは通知リクエスト受信時に設定される）
      const connectionHandler = getConnectionHandler();
      connectionHandler(subscribedWs);

      const messageHandler = subscribedWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      // 購読リクエストを送信（これにより通知状態が有効になる）
      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      // Don状態を通知
      const donState: Don[] = [
        { id: '1', state: 'ordered' },
        { id: '2', state: 'cooking' },
      ];
      donChannel.notifyActiveDonState(donState);

      // 購読済みクライアントにのみ送信されることを確認
      expect(subscribedWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'state',
          data: { dons: donState },
        }),
      );
      expect(nonSubscribedWs.send).not.toHaveBeenCalled();
    });

    it('OPEN状態のWebSocketにのみメッセージが送信される', () => {
      const openWs = createMockWebSocket();
      const closedWs = { ...createMockWebSocket(), readyState: WebSocket.CLOSED };

      mockWss.clients = new Set([openWs, closedWs]);

      // 両方のクライアントを購読状態にする
      const connectionHandler = getConnectionHandler();
      connectionHandler(openWs);
      connectionHandler(closedWs);

      const openMessageHandler = openWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
      const closedMessageHandler = closedWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      openMessageHandler(requestMessage);
      closedMessageHandler(requestMessage);

      const donState: Don[] = [{ id: '1', state: 'ordered' }];
      donChannel.notifyActiveDonState(donState);

      expect(openWs.send).toHaveBeenCalled();
      expect(closedWs.send).not.toHaveBeenCalled();
    });

    it('送信されるメッセージのフォーマットが正しい', () => {
      const mockWs = createMockWebSocket();
      mockWss.clients = new Set([mockWs]);

      const connectionHandler = getConnectionHandler();
      connectionHandler(mockWs);

      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      const donState: Don[] = [{ id: 'test-id', state: 'cooking' }];
      donChannel.notifyActiveDonState(donState);

      const expectedMessage = JSON.stringify({
        type: 'state',
        data: { dons: donState },
      });

      expect(mockWs.send).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe('WebSocket切断・エラー処理', () => {
    it('closeイベント時に通知状態がクリアされる', () => {
      const mockWs = createMockWebSocket();
      const connectionHandler = getConnectionHandler();

      connectionHandler(mockWs);

      // closeハンドラーを取得
      const closeHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];

      // 通知状態を設定
      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      // 通知が有効であることを確認
      mockWs.send.mockClear();
      mockWss.clients = new Set([mockWs]);
      donChannel.notifyActiveDonState([{ id: '1', state: 'ordered' }]);
      expect(mockWs.send).toHaveBeenCalled();

      // closeイベントを発火
      closeHandler();

      // 通知状態がクリアされ、メッセージが送信されないことを確認
      mockWs.send.mockClear();
      donChannel.notifyActiveDonState([{ id: '1', state: 'ordered' }]);
      expect(mockWs.send).not.toHaveBeenCalled();
    });

    it('errorイベント時に通知状態がクリアされる', () => {
      const mockWs = createMockWebSocket();
      const connectionHandler = getConnectionHandler();

      connectionHandler(mockWs);

      // errorハンドラーを取得
      const errorHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'error')[1];

      // 通知状態を設定
      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      // 通知が有効であることを確認
      mockWs.send.mockClear();
      mockWss.clients = new Set([mockWs]);
      donChannel.notifyActiveDonState([{ id: '1', state: 'ordered' }]);
      expect(mockWs.send).toHaveBeenCalled();

      // errorイベントを発火
      const error = new Error('Connection error');
      errorHandler(error);

      // 通知状態がクリアされ、メッセージが送信されないことを確認
      mockWs.send.mockClear();
      donChannel.notifyActiveDonState([{ id: '1', state: 'ordered' }]);
      expect(mockWs.send).not.toHaveBeenCalled();
    });
  });
});
