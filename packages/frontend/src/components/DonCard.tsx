import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import InfoRow from "./InfoRow"; // InfoRowをインポート
import { components } from "api/schema";
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

export const DonCard = (don: Don) => {
  const { id } = don;
  const customs: Custom[] = [
    {
      key: "yasai",
      label: "ヤサイ",
      amount: don.yasai,
      defaultAmount: 0,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
    {
      key: "ninniku",
      label: "ニンニク",
      amount: don.ninniku,
      defaultAmount: 0,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
    {
      key: "karame",
      label: "カラメ",
      amount: don.karame,
      defaultAmount: 0,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
    {
      key: "abura",
      label: "アブラ",
      amount: don.abura,
      defaultAmount: 0,
      incrementBgColor: "red.100",
      decrementBgColor: "blue.100",
    },
  ]

  interface CustomsContentProps {
    customs: Custom[];
  }

  const CustomsContent: React.FC<CustomsContentProps> = ({ customs }) => {
    return (
      customs.map((custom) => (
        <InfoRow
          key={custom.key}
          label={custom.label}
          amount={custom.amount}
          defaultAmount={custom.defaultAmount}
          incrementBgColor={custom.incrementBgColor}
          decrementBgColor={custom.decrementBgColor}
        />
      ))
    );
  }

  interface ToppingsContentProps { 
    toppings: Don["toppings"];
  }

  const ToppingsContent: React.FC<ToppingsContentProps> = ({toppings}) => {
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

  return (
    <Box width="300px" height="100%">
      <Card variant="outline" borderWidth="3px" width="300px" height="80%">
        <CardHeader bg="cyan" margin="10px" borderRadius="md">
          <Heading size="3xl" fontWeight="bold" textAlign="center">
            {id}
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Stack spacing="4">
              <CustomsContent customs={customs} />
            </Stack>
            <Stack spacing="4">
              <ToppingsContent toppings={don.toppings} />
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
