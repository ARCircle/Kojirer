type MockProps = {
  numOrders: number;
};

export const generateMockOrders = ({ numOrders }: MockProps): Order[] => {
  const orders: Order[] = [];

  // Generate mock data for orders
  for (let i = 1; i <= numOrders; i++) {
    const dons: Don[] = [];
    const numDons = Math.floor(Math.random() * 4) + 2;

    // Generate mock data for dons
    for (let j = 1; j <= numDons; j++) {
      const don: Don = {
        id: j,
        status: Math.floor(Math.random() * 3),
      };
      dons.push(don);
    }

    const order: Order = {
      id: 200 + i,
      dons: dons,
    };

    orders.push(order);
  }

  return orders;
};
