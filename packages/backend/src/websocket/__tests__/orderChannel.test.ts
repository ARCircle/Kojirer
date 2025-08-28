import { vi, describe, it, expect, beforeEach } from 'vitest';
import { WebSocketOrderChannel } from '../orderChannel';
import { WebSocket, WebSocketServer } from 'ws';
import { Order } from '../messages';

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

describe('WebSocketOrderChannel', () => {
  let orderChannel: WebSocketOrderChannel;
  let mockWss: WebSocketServer;

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

    orderChannel = new WebSocketOrderChannel({ wss: mockWss });
  });

  it('WebSocketOrderChannelが初期化される', () => {
    expect(orderChannel).toBeDefined();
    expect(mockWss.on).toHaveBeenCalledWith('connection', expect.any(Function));
    expect(mockWss.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  describe('メッセージ処理', () => {
    it('正常なRequestNotificationMessageを受信して通知状態が有効になる', () => {
      const mockWs = createMockWebSocket();
      const connectionHandler = getConnectionHandler();

      connectionHandler(mockWs);

      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      const validMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(validMessage);

      // 通知が有効になっていることを確認
      mockWss.clients = new Set([mockWs]);
      orderChannel.notifyActiveOrderState([{ id: '1', call_num: 1, state: 'ordered' }]);

      expect(mockWs.send).toHaveBeenCalled();
    });
  });

  describe('Order状態通知', () => {
    it('通知購読中のクライアントにのみメッセージが送信される', () => {
      const subscribedWs = createMockWebSocket();
      const nonSubscribedWs = createMockWebSocket();

      mockWss.clients = new Set([subscribedWs, nonSubscribedWs]);

      const connectionHandler = getConnectionHandler();
      connectionHandler(subscribedWs);

      const messageHandler = subscribedWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      const orderState: Order[] = [
        { id: '1', call_num: 1, state: 'ordered' },
        { id: '2', call_num: 2, state: 'ready' },
      ];
      orderChannel.notifyActiveOrderState(orderState);

      expect(subscribedWs.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'state',
          data: { orders: orderState },
        }),
      );
      expect(nonSubscribedWs.send).not.toHaveBeenCalled();
    });

    it('OPEN状態のWebSocketにのみメッセージが送信される', () => {
      const openWs = createMockWebSocket();
      const closedWs = { ...createMockWebSocket(), readyState: WebSocket.CLOSED };

      mockWss.clients = new Set([openWs, closedWs]);

      const connectionHandler = getConnectionHandler();
      connectionHandler(openWs);
      connectionHandler(closedWs);

      const openMessageHandler = openWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
      const closedMessageHandler = closedWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      openMessageHandler(requestMessage);
      closedMessageHandler(requestMessage);

      const orderState: Order[] = [{ id: '1', call_num: 1, state: 'ordered' }];
      orderChannel.notifyActiveOrderState(orderState);

      expect(openWs.send).toHaveBeenCalled();
      expect(closedWs.send).not.toHaveBeenCalled();
    });

    it('送信されるメッセージのフォーマットが正しい', () => {
      const mockWs = createMockWebSocket();
      mockWss.clients = new Set([mockWs]);

      const connectionHandler = getConnectionHandler();
      connectionHandler(mockWs);

      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

      const requestMessage = JSON.stringify({ type: 'request', data: { include: false } });
      messageHandler(requestMessage);

      const orderState: Order[] = [{ id: 'test-id', call_num: 123, state: 'ready' }];
      orderChannel.notifyActiveOrderState(orderState);

      const expectedMessage = JSON.stringify({
        type: 'state',
        data: { orders: orderState },
      });

      expect(mockWs.send).toHaveBeenCalledWith(expectedMessage);
    });
  });

  describe('WebSocket切断・エラー処理', () => {
    it('closeイベント時に通知状態がクリアされる', () => {
      const mockWs = createMockWebSocket();
      const connectionHandler = getConnectionHandler();

      connectionHandler(mockWs);

      const closeHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'close')[1];

      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      // 通知が有効であることを確認
      mockWs.send.mockClear();
      mockWss.clients = new Set([mockWs]);
      orderChannel.notifyActiveOrderState([{ id: '1', call_num: 1, state: 'ordered' }]);
      expect(mockWs.send).toHaveBeenCalled();

      // closeイベントを発火
      closeHandler();

      // 通知状態がクリアされ、メッセージが送信されないことを確認
      mockWs.send.mockClear();
      orderChannel.notifyActiveOrderState([{ id: '1', call_num: 1, state: 'ordered' }]);
      expect(mockWs.send).not.toHaveBeenCalled();
    });

    it('errorイベント時に通知状態がクリアされる', () => {
      const mockWs = createMockWebSocket();
      const connectionHandler = getConnectionHandler();

      connectionHandler(mockWs);

      const errorHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'error')[1];

      const messageHandler = mockWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];
      const requestMessage = JSON.stringify({ type: 'request', data: { include: true } });
      messageHandler(requestMessage);

      // 通知が有効であることを確認
      mockWs.send.mockClear();
      mockWss.clients = new Set([mockWs]);
      orderChannel.notifyActiveOrderState([{ id: '1', call_num: 1, state: 'ordered' }]);
      expect(mockWs.send).toHaveBeenCalled();

      // errorイベントを発火
      const error = new Error('Connection error');
      errorHandler(error);

      // 通知状態がクリアされ、メッセージが送信されないことを確認
      mockWs.send.mockClear();
      orderChannel.notifyActiveOrderState([{ id: '1', call_num: 1, state: 'ordered' }]);
      expect(mockWs.send).not.toHaveBeenCalled();
    });
  });
});
