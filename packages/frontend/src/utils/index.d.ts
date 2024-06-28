type Don = {
  id: number;
  status: number;
};

type Order = {
  id: number;
  dons: Don[];
};

type MockProps = {
  numOrders: number;
};
