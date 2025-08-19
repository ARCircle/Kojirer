/**
 * WebSocketで流れるメッセージの型定義
 */

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
    dons: Don[];
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
export type Don = {
  id: string;
  state: 'ordered' | 'cooking' | 'cooked' | 'delivered' | 'cancelled';
};
