import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { animated, useSpring } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { components } from 'api/schema';
import React from 'react';
import InfoRow from './InfoRow';

type Don = components['schemas']['Don'];

type Custom = {
  key: string;
  label: string;
  amount: number;
  defaultAmount: number;
  incrementBgColor: string;
  decrementBgColor: string;
};

interface DonCardProps {
  don: Don;
  completeCooking?: (id: number) => void;
}

export const DonCard: React.FC<DonCardProps> = ({ don, completeCooking }) => {
  const id = don.id;

  // スワイプアニメーションの設定
  const [{ y }, api] = useSpring(() => ({ y: 0 }));

  const bind = useDrag(
    ({ active, movement: [, my] }) => {
      if (active && my < 0) {
        // 上方向にのみスワイプ
        api.start({ y: my });
      } else if (!active) {
        // スワイプが終わったときに閾値を超えていたらcompleteCookingを呼び出す
        if (my < -700 && completeCooking) {
          completeCooking(id);
        }
        // 元の位置に戻す
        api.start({ y: 0 });
      }
    },
    { axis: 'y' },
  );

  function renderCustomsContent(customs: Custom[]) {
    return customs.map((custom) => (
      <InfoRow
        key={custom.key}
        label={custom.label}
        amount={custom.amount}
        defaultAmount={custom.defaultAmount}
        incrementBgColor={custom.incrementBgColor}
        decrementBgColor={custom.decrementBgColor}
      />
    ));
  }

  function renderToppingsContent(toppings: Don['toppings']) {
    if (toppings) {
      return toppings.map((topping) => (
        <InfoRow
          key={topping.id}
          label={topping.label}
          amount={topping.amount}
          defaultAmount={0}
          incrementBgColor='yellow.200'
          decrementBgColor='lightgray'
        />
      ));
    }
    return null;
  }

  const customs: Custom[] = [
    {
      key: 'yasai',
      label: 'ヤサイ',
      amount: don.yasai,
      defaultAmount: 3,
      incrementBgColor: 'red.100',
      decrementBgColor: 'blue.100',
    },
    {
      key: 'ninniku',
      label: 'ニンニク',
      amount: don.ninniku,
      defaultAmount: 3,
      incrementBgColor: 'red.100',
      decrementBgColor: 'blue.100',
    },
    {
      key: 'karame',
      label: 'カラメ',
      amount: don.karame,
      defaultAmount: 3,
      incrementBgColor: 'red.100',
      decrementBgColor: 'blue.100',
    },
    {
      key: 'abura',
      label: 'アブラ',
      amount: don.abura,
      defaultAmount: 3,
      incrementBgColor: 'red.100',
      decrementBgColor: 'blue.100',
    },
  ];

  return (
    <animated.div
      {...bind()}
      style={{ transform: y.to((val) => `translateY(${val}px)`), touchAction: 'none', height: '100%' }}
    >
      <div className="w-[300px] h-full">
        <div className="h-[10%]"></div>
        <Card className="border-2 w-[300px] h-[80%]">
          <CardHeader className="bg-cyan-400 m-2 rounded-md">
            <h1 className="text-5xl font-bold text-center">
              {id}
            </h1>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-4 border-b pb-4">
                {renderCustomsContent(customs)}
              </div>
              <div className="space-y-4">
                {renderToppingsContent(don.toppings)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </animated.div>
  );
};
