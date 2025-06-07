import { $api } from '@/utils/client';
import { Card, ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { components } from 'api/schema';

type Option = components['schemas']['Option'];

export interface ReceptionDonCardProps {
  index: number;
  isSelecting?: boolean;
  onClick?: () => void;
  size: number;
  yasai: number;
  ninniku: number;
  abura: number;
  karame: number;
  toppings: {
    id: number;
    amount: number;
  }[];
}

const searchLabel = (target: number, options: Option[]) =>
  options?.filter((option) => option.id === target)[0]?.label || '';

const ReceptionDonCard: React.FC<ReceptionDonCardProps> = ({
  index,
  isSelecting = false,
  onClick = () => {},
  abura,
  karame,
  ninniku,
  toppings,
}) => {
  const { data: options } = $api.useQuery('get', '/options');
  const { data: toppingData } = $api.useQuery('get', '/toppings/available');

  return (
    <Card w='100%' p={4} variant='outline' mt={2} borderColor={isSelecting ? 'red' : undefined} onClick={onClick}>
      <Text>丼 #{index}</Text>
      <Text>アブラ: {searchLabel(abura, options || [])}</Text>
      <Text>カラメ: {searchLabel(karame, options || [])}</Text>
      <Text>ニンニク: {searchLabel(ninniku, options || [])}</Text>
      <Text>トッピング</Text>
      <UnorderedList>
        {toppings.map((topping, idx) => (
          <ListItem key={idx}>
            {toppingData ? toppingData[idx].label : ''}: {topping.amount}
          </ListItem>
        ))}
      </UnorderedList>
    </Card>
  );
};

export default ReceptionDonCard;
