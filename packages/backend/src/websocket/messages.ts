/**
 * WebSocketで流れるメッセージの型定義
 */

import { components } from 'api/schema';

/**
 * クライアント側が送信する通知リクエスト
 * https://arcircle.github.io/Kojirer/asyncapi/#message-undefined
 */
export type RequestNotificationMessage = {
  type: 'request';
  data: RequestOption;
};

/**
 * サーバーがDonの状態を通知するメッセージ
 * https://arcircle.github.io/Kojirer/asyncapi/#message-undefined
 */
export type DonStateMessage = {
  type: 'state';
  data: {
    dons: WebSocketDon[];
  };
};

/**
 * サーバーがOrderの状態を通知するメッセージ
 * https://arcircle.github.io/Kojirer/asyncapi/#message-undefined
 */
export type OrderStateMessage = {
  type: 'state';
  data: {
    orders: WebSocketOrder[];
  };
};

/**
 * WebSocketスキーマにおけるRequestOptionオブジェクト
 * https://arcircle.github.io/Kojirer/asyncapi/#schema-requestOption
 */
export type RequestOption = {
  include: boolean;
};

/**
 * WebSocketスキーマにおけるDonオブジェクト
 * https://arcircle.github.io/Kojirer/asyncapi/#schema-don
 */
export type WebSocketDon = {
  id: string;
  state: 'ordered' | 'cooking' | 'cooked' | 'delivered' | 'cancelled';
};

/**
 * WebSocketスキーマにおけるOrderオブジェクト
 * https://arcircle.github.io/Kojirer/asyncapi/#schema-order
 */
export type WebSocketOrder = {
  id: string;
  call_num: number; // TODO: このnumber微妙すぎるので後で考える
  state: 'ordered' | 'ready' | 'delivered' | 'cancelled';
  dons?: WebSocketDon[]; // include: falseならundef, trueだがDonがない場合は空配列
};

type ActiveDon = components['schemas']['ActiveDon'];
/**
 * WebSocket用のDonオブジェクトコンバーター
 */
export const donConverter = {
  /**
   * ActiveDonからWebSocketDonを得る
   */
  fromActiveDon: (don: ActiveDon): WebSocketDon => {
    return {
      id: don.id,
      state: don.status,
    };
  },
};
