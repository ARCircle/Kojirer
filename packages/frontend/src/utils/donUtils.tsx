export const createExampleDon = (id: number): Don => ({
  id,
  status: 2,
  customise: {
    "ヤサイ": 2,
    "アブラ": 1,
    "ニンニク": -1,
    "カラメ": 0,
  },
  toppings: {
    "マヨ": 0,
    "レモン汁": -1,
    "カレー粉": 1,
    "フライドオニオン": 2,
  },
});

export const createExampleDons = (count: number): Don[] => {
  return Array.from({ length: count }, (_, index) => createExampleDon(index + 1));
};
