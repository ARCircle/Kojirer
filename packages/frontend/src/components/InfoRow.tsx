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

  const diff = amount - defaultAmount;

  return (
    <Card bg={
        diff > 0 && incrementBgColor ||
        diff == -1 && decrementBgColor ||
        'gray.100'
      } 
      variant="outline" 
      borderWidth={0}
    >
      <SimpleGrid columns={2} gridTemplateColumns="3fr 7fr" gap={0}>
        <Box px={2} display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="4xl" fontWeight="bold" color={
            diff > 0 && 'red.500' ||
            diff == -1 && 'blue.500' ||
            'gray.500'
          }>
            {diff > 0 && '＋'}
            {diff == -1 && 'ー'}
            {diff == -2 && '×'}
            {diff > 1 ? diff : ''}
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
