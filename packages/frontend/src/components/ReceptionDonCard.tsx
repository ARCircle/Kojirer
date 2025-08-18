// import { $api } from '@/utils/client';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// import { components } from 'api/schema';

// type Option = components['schemas']['Option'];

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

// const searchLabel = (target: number, options: Option[]) =>
//   options?.filter((option) => option.id === target)[0]?.label || '';

const ReceptionDonCard: React.FC<ReceptionDonCardProps> = ({
  index,
  isSelecting = false,
  onClick = () => {},
  // abura,
  // karame,
  // ninniku,
  // toppings,
}) => {
  // const { data: options } = $api.useQuery('get', '/options');
  // const { data: toppingData } = $api.useQuery('get', '/toppings/available');

  return (
    <Card
      className={cn('w-full p-4 mt-2 cursor-pointer', isSelecting ? 'border-red-500 border-2' : 'border')}
      onClick={onClick}
    >
      <div className='space-y-2'>
        <div className='font-medium'>丼 #{index}</div>
        {/* <div>アブラ: {searchLabel(abura, options || [])}</div>
        <div>カラメ: {searchLabel(karame, options || [])}</div>
        <div>ニンニク: {searchLabel(ninniku, options || [])}</div> */}
        <div>トッピング</div>
        <ul className='list-disc list-inside pl-4'>
          {/* {toppings.map((topping, idx) => (
            <li key={idx}>
              {toppingData ? toppingData[idx]?.label : ''}: {topping.amount}
            </li>
          ))} */}
        </ul>
      </div>
    </Card>
  );
};

export default ReceptionDonCard;
