interface Dictionary {
  [key: string]: number; // キーは文字列、値は数値
}

type Customise = Dictionary & {
  "ヤサイ": number;
  "アブラ": number;
  "ニンニク": number;
  "カラメ": number;
}

type Toppings = Dictionary & {
  "マヨ": number;
  "レモン汁": number;
  "カレー粉": number;
  "フライドオニオン": number;
}

type Don = {
  id: number;
  status: number;
  customise?: Customise;
  toppings?: Toppings;
};

type Order = {
  id: number;
  dons: Don[];
};

type MockProps = {
  numOrders: number;
};
