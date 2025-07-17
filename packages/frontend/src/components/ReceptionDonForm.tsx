import { $api } from '@/utils/client';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { paths } from 'api/schema';
import React, { useEffect, useState } from 'react';
import ReceptionDonOptionRadio from './ReceptionDonOptionRadio';
import ReceptionToppingNumberInput from './ReceptionToppingNumberInput';

type Don = paths['/order']['post']['requestBody']['content']['application/json']['dons'][0] & { uniqueId: string };

interface ReceptionDonFormProps {
  index?: number | null;
  uniqueId?: string | null;
  onSubmit?: (don: Don) => void;
  onEdit?: (idx: number, don: Don) => void;
  size?: number | null;
  yasai?: number | null;
  ninniku?: number | null;
  abura?: number | null;
  karame?: number | null;
  toppings?:
    | {
        id: number;
        amount: number;
      }[]
    | null;
}

const costomizeLabels: {
  label: string;
  value: 'karame' | 'abura' | 'ninniku';
}[] = [
  { label: 'アブラ', value: 'abura' },
  {
    label: 'カラメ',
    value: 'karame',
  },
  { label: 'ニンニク', value: 'ninniku' },
];

const ReceptionDonForm: React.FC<ReceptionDonFormProps> = ({
  index,
  uniqueId,
  abura,
  karame,
  ninniku,
  toppings,
  onSubmit = () => {},
  onEdit = () => {},
}) => {
  const { data: toppingData } = $api.useQuery('get', '/toppings/available');

  const indexIsUndefined = index !== 0 && !index;
  const isEdit = !indexIsUndefined && !!uniqueId && !!abura && !!karame && !!ninniku && !!toppings;
  const initialCostomizeState = isEdit ? [abura, karame, ninniku] : [...Array(3)].map(() => 3);

  const initialToppingAmountsState = isEdit
    ? toppings.map((t) => t.amount)
    : [...Array(toppingData?.length)].map(() => 0);

  const [costomizes, setCostomizes] = useState<number[]>(initialCostomizeState);
  const [toppingAmounts, setToppingAmounts] = useState<number[]>(initialToppingAmountsState);
  const [canDecrement, setCanDecrement] = useState(false);

  const title = isEdit ? `丼 #${index + 1} の編集` : '新規注文';

  useEffect(() => {
    setCostomizes(initialCostomizeState);
    setToppingAmounts(initialToppingAmountsState);
  }, [isEdit, toppingData]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const _toppings = toppingAmounts.map((amount, idx) => ({
      id: toppingData ? Number(toppingData[idx].id) : 0,
      amount,
    }));

    isEdit
      ? onEdit(index, {
          size: 1,
          yasai: 3,
          abura: Number(costomizes[0]),
          karame: Number(costomizes[1]),
          ninniku: Number(costomizes[2]),
          toppings: _toppings,
          uniqueId,
        })
      : onSubmit({
          size: 1,
          yasai: 3,
          abura: Number(costomizes[0]),
          karame: Number(costomizes[1]),
          ninniku: Number(costomizes[2]),
          toppings: _toppings,
          uniqueId: new Date().getTime().toString(),
        });

    setCostomizes(initialCostomizeState);
    setToppingAmounts(initialToppingAmountsState);
  };

  const cancel = () => {
    const _toppings = initialToppingAmountsState.map((amount, idx) => ({
      id: toppingData ? Number(toppingData[idx].id) : 0,
      amount,
    }));

    isEdit &&
      onEdit(index, {
        size: 1,
        yasai: 3,
        abura: Number(initialCostomizeState[0]),
        karame: Number(initialCostomizeState[1]),
        ninniku: Number(initialCostomizeState[2]),
        toppings: _toppings,
        uniqueId,
      });
  };

  return (
    <form onSubmit={submit}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {isEdit && (
          <div>
            <Button onClick={cancel} variant="outline">キャンセル</Button>
          </div>
        )}
      </div>
      
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-xl font-medium">オプション</span>
        </div>
      </div>

      <div className="space-y-4">
        {costomizeLabels.map(({ label }, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-4 pb-4">
            <div className="col-span-3 flex items-center">
              <span className="text-xl">{label}</span>
            </div>
            <div className="col-span-9">
              <ReceptionDonOptionRadio
                value={costomizes[idx]}
                onChange={(value) => {
                  setCostomizes(costomizes.map((c, index) => (index === idx ? value : c)));
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center">
        <div className="relative py-8 w-3/4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xl font-medium">トッピング</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="can-decrement" className="text-sm">
            デクリメントモード
          </Label>
          <Switch id="can-decrement" checked={canDecrement} onCheckedChange={setCanDecrement} />
        </div>
      </div>

      {toppingData?.map(({ id, label }, idx) => (
        <div key={id} className="grid grid-cols-12 gap-4 pb-4">
          <div className="col-span-3 flex items-center justify-center">
            <span className="text-xl">{label}</span>
          </div>
          <div className="col-span-9">
            <ReceptionToppingNumberInput
              canDecrement={canDecrement}
              value={toppingAmounts[idx]}
              onChange={(value) => {
                setToppingAmounts(toppingAmounts.map((t, index) => (index === idx ? value : t)));
              }}
            />
          </div>
        </div>
      ))}

      <div className="pt-8">
        <Button variant="teal" type="submit" className="w-full">
          {isEdit ? '編集' : '追加'}
        </Button>
      </div>
    </form>
  );
};

export default ReceptionDonForm;
