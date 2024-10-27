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

export const DonCard = (don: Don) => {
  const id = don.id;

  function renderCustomiseContent(customise: Don["customise"]) {
    if (customise) {
      return Object.keys(customise).map((key) => (
        <InfoRow
          key={key}
          label={key}
          amount={customise[key]}
          defaultAmount={0}
          incrementBgColor="red.100"
          decrementBgColor="blue.100"
        />
      ));
    }
    return null;
  }

  function renderToppingsContent(toppings: Don["toppings"]) {
    if (toppings) {
      return Object.keys(toppings)
        .filter((key) => toppings[key] >= 0) // 個数が負の場合はスキップ
        .map((key) => (
          <InfoRow
            key={key}
            label={key}
            amount={toppings[key]}
            defaultAmount={0}
            incrementBgColor="yellow.200"
            decrementBgColor="lightgray"
          />
        ));
    }
    return null;
  }

  return (
    <Box width="300px">
      <Card variant="outline" borderWidth="3px" width="300px">
        <CardHeader bg="cyan" margin="10px" borderRadius="md">
          <Heading size="3xl" fontWeight="bold" textAlign="center">
            {id}
          </Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Stack spacing="4">
              {renderCustomiseContent(don.customise)}
            </Stack>
            <Stack spacing="4">
              {renderToppingsContent(don.toppings)}
            </Stack>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};
