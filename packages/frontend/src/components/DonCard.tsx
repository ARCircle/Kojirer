import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import InfoRow from "./InfoRow";
import { components } from "api/schema";
import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import React from "react";

type Don = components["schemas"]["Don"];

type Custom = {
  key: string;
  label: string;
  amount: number;
  defaultAmount: number;
  incrementBgColor: string;
  decrementBgColor: string;
}

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
    { axis: "y" }
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

  function renderToppingsContent(toppings: Don["toppings"]) {
    if (toppings) {
      return toppings.map((topping) => (
        <InfoRow
          key={topping.id}
          label={topping.label}
          amount={topping.amount}
          defaultAmount={0}
          incrementBgColor="yellow.200"
          decrementBgColor="lightgray"
        />
      ));
    }
    return null;
  }

  const customs: Custom[] = [
    {
      key: "yasai",
      label: "ヤサイ",
      amount: don.yasai,
      defaultAmount: 3,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
    {
      key: "ninniku",
      label: "ニンニク",
      amount: don.ninniku,
      defaultAmount: 3,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
    {
      key: "karame",
      label: "カラメ",
      amount: don.karame,
      defaultAmount: 3,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
    {
      key: "abura",
      label: "アブラ",
      amount: don.abura,
      defaultAmount: 3,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
  ];

  return (
    <animated.div {...bind()} style={{ transform: y.to((val) => `translateY(${val}px)`), touchAction: "none", height: "100%" }}>
      <Box width="300px" height="100%">
        <Box height="10%"></Box>
        <Card variant="outline" borderWidth="3px" width="300px" height="80%">
          <CardHeader bg="cyan" margin="10px" borderRadius="md">
            <Heading size="3xl" fontWeight="bold" textAlign="center">
              {id}
            </Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Stack spacing="4">
                {renderCustomsContent(customs)}
              </Stack>
              <Stack spacing="4">
                {renderToppingsContent(don.toppings)}
              </Stack>
            </Stack>
          </CardBody>
        </Card>
      </Box>
    </animated.div>
  );
};
