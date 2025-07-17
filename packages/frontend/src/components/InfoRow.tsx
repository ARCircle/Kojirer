import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface InfoRowProps {
  label: string;
  amount: number;
  defaultAmount: number;
  incrementBgColor: string;
  decrementBgColor: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, amount, defaultAmount, incrementBgColor, decrementBgColor }) => {
  if (amount === defaultAmount) {
    return null; // デフォルトから変わらないときは表示しない
  }

  const diff = amount - defaultAmount;

  const getBgColor = () => {
    if (diff > 0) {
      return incrementBgColor === 'red.100' ? 'bg-red-100' : incrementBgColor === 'yellow.200' ? 'bg-yellow-200' : 'bg-red-100';
    } else if (diff == -1) {
      return decrementBgColor === 'blue.100' ? 'bg-blue-100' : decrementBgColor === 'lightgray' ? 'bg-gray-200' : 'bg-blue-100';
    }
    return 'bg-gray-100';
  };

  const getTextColor = () => {
    if (diff > 0) return 'text-red-500';
    if (diff == -1) return 'text-blue-500';
    return 'text-gray-500';
  };

  return (
    <Card className={cn('border-0', getBgColor())}>
      <div className="grid grid-cols-10 gap-0">
        <div className="col-span-3 px-2 flex items-center justify-center">
          <span className={cn('text-4xl font-bold', getTextColor())}>
            {diff > 0 && '＋'}
            {diff == -1 && 'ー'}
            {diff == -2 && '×'}
            {diff > 1 ? diff : ''}
          </span>
        </div>
        <div className="col-span-7 pl-1 flex items-center justify-start">
          <span className="text-xl font-bold">
            {label}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default InfoRow;
