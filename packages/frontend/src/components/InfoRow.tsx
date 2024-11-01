import { Box, SimpleGrid, Text, Card } from "@chakra-ui/react";


interface InfoRowProps {
  label: string;
  amount: number;
  defaultAmount: number;
  incrementBgColor: string;
  decrementBgColor: string;
}

const InfoRow: React.FC<InfoRowProps> = ({
  label,
  amount,
  defaultAmount,
  incrementBgColor,
  decrementBgColor,
}) => {
  if (amount === defaultAmount) {
    return null; // デフォルトから変わらないときは表示しない
  }

  return (
    <Card bg={
            amount > 0 && incrementBgColor ||
            amount == -1 && decrementBgColor ||
            'gray.100'
          } variant="outline" borderWidth={0}>
      <SimpleGrid columns={2} gridTemplateColumns="3fr 7fr" gap={0}>
        <Box px={2} display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="4xl" fontWeight="bold" color={
            amount > 0 && 'red.500' ||
            amount == -1 && 'blue.500' ||
            'gray.500'
          }>
            {amount > 0 && '＋'}
            {amount == -1 && 'ー'}
            {amount == -2 && '×'}
            {amount > 1 ? amount : ''}
          </Text>
        </Box>
        <Box pl={1} display="flex" alignItems="center" justifyContent="left">
          <Text fontSize="xl" fontWeight="bold">
            {label}
          </Text>
        </Box>
      </SimpleGrid>
    </Card>
  );
};

export default InfoRow;
