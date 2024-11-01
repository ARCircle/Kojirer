import React, { useEffect, useState } from "react";
import ReceptionDonOptionRadio from "./ReceptionDonOptionRadio";
import ReceptionToppingNumberInput from "./ReceptionToppingNumberInput";
import { $api } from "@/utils/client";
import { 
  AbsoluteCenter, 
  Box, 
  Button, 
  Center, 
  Divider, 
  Flex, 
  FormLabel, 
  Grid,
  GridItem,
  HStack,
  Switch,
  Text,
  useBoolean,
  VStack 
} from "@chakra-ui/react";
import { paths } from "api/schema";

type Don = paths["/order"]["post"]["requestBody"]["content"]["application/json"]["dons"][0];

interface ReceptionDonFormProps {
  index?: number | null,
  onSubmit?: (don: Don) => void,
  onEdit?: (idx: number, don: Don) => void,
  size?: number | null,
  yasai?: number | null,
  ninniku?: number | null,
  abura?: number | null,
  karame?: number | null,
  toppings?: {
    id: number,
    amount: number,
  }[] | null
}

const costomizeLabels: {
  label: string,
  value: 'karame' | 'abura' | 'ninniku'
}[] = [
  { label: 'アブラ',
    value: 'abura',
  },  
  { 
    label: 'カラメ',
    value: 'karame',
  },
  { label: 'ニンニク',
    value: 'ninniku',
  },
];

const ReceptionDonForm: React.FC<ReceptionDonFormProps> = ({
  index,
  abura,
  karame,
  ninniku,
  toppings,
  onSubmit = () => {},
  onEdit = () => {},
}) => {
  const { data: toppingData } = $api.useQuery('get', '/toppings/available');

  const indexIsUndefined = index !== 0 && !index
  const isEdit = !indexIsUndefined && !!abura && !!karame && !!ninniku && !!toppings;
  const initialCostomizeState = 
    isEdit ? 
    [ abura, karame, ninniku ] : 
    [...Array(3)].map(() => 3);

  const initialToppingAmountsState = 
    isEdit ? 
    toppings.map((t) => t.amount) : 
    [...Array(toppingData?.length)].map(() => 0);

  const [ costomizes, setCostomizes ] = useState<number[]>(initialCostomizeState);
  const [ toppingAmounts, setToppingAmounts ] = useState<number[]>(initialToppingAmountsState);
  const [ canDecrement, { toggle } ] = useBoolean(false);

  const title = isEdit ? `丼 #${index} の編集` : '新規注文';

  useEffect(() => {
    setCostomizes(initialCostomizeState);
    setToppingAmounts(initialToppingAmountsState)
  }, [isEdit, toppingData]);

  const submit = (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    
    const _toppings = toppingAmounts.map((amount, idx) => ({
      id: toppingData ? Number(toppingData[idx].id) : 0,
      amount,
    }));
    console.log(_toppings)

    isEdit ? 
    onEdit(
      index, {
        size: 1,
        yasai: 3,
        abura: Number(costomizes[0]),
        karame: Number(costomizes[1]),
        ninniku: Number(costomizes[2]),
        toppings: _toppings,
      }
    ):
    onSubmit({
      size: 1,
      yasai: 3,
      abura: Number(costomizes[0]),
      karame: Number(costomizes[1]),
      ninniku: Number(costomizes[2]),
      toppings: _toppings,
    });

    setCostomizes(initialCostomizeState);
    setToppingAmounts(initialToppingAmountsState);
  }

  const cancel = () => {
    const _toppings = initialToppingAmountsState.map((amount, idx) => ({
      id: toppingData ? Number(toppingData[idx].id) : 0,
      amount,
    }));

    isEdit &&
    onEdit(
      index, {
        size: 1,
        yasai: 3,
        abura: Number(initialCostomizeState[0]),
        karame: Number(initialCostomizeState[1]),
        ninniku: Number(initialCostomizeState[2]),
        toppings: _toppings,
      }
    )
  }
 
  return (
    <form onSubmit={submit}>
      <HStack justify="space-between">
        <Text fontSize='3xl'>{ title }</Text>
        { isEdit &&
          <div>
            <Button onClick={cancel}>キャンセル</Button>
          </div>
        }
      </HStack>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg='white' px='4'>
          <Text fontSize='xl'>オプション</Text>
        </AbsoluteCenter>
      </Box>
      
      <VStack align='stretch' gap={4}>
      {
        costomizeLabels.map(({ label }, idx) => 
          <Grid key={idx} templateColumns='repeat(12, 1fr)' pb={4}>
            <GridItem colSpan={3}>
              <Text fontSize='xl'>{ label }</Text>
            </GridItem>
            <GridItem colSpan={9}>
              <ReceptionDonOptionRadio 
                value={costomizes[idx]}
                onChange={(value) => {
                  setCostomizes(
                    costomizes.map((c, index) => (index === idx ? value : c))
                  );
                }}
              />
            </GridItem>
          </Grid>
        )
      }
      </VStack>

      <Flex>
        <Box position='relative' padding='10' w='90%'>
          <Divider />
          <AbsoluteCenter bg='white' px='4'>
            <Text fontSize='xl'>トッピング</Text>
          </AbsoluteCenter>
        </Box>
        <Center>
          <FormLabel htmlFor='can-decrement' mb='0' fontSize='sm'>
            デクリメントモード
          </FormLabel>
          <Switch id='can-decrement' size='lg' onChange={toggle}/>
        </Center>
      </Flex>
      
      {
        toppingData?.map(({ id, label }, idx) => 
          <Grid key={id} templateColumns='repeat(12, 1fr)' pb={4}>
            <GridItem colSpan={3}>
              <Center>
                <Text fontSize='xl'>{ label }</Text>
              </Center>
            </GridItem>
            <GridItem colSpan={9}>
              <ReceptionToppingNumberInput 
                canDecrement={canDecrement}
                value={toppingAmounts[idx]}
                onChange={(value) => {
                  setToppingAmounts(
                    toppingAmounts.map((t, index) => (index === idx ? value : t))
                  );
                }}
              />
            </GridItem>
          </Grid>
        )
      }

      <VStack align='stretch' pt={10}>
        <Button 
          colorScheme='teal'
          type="submit"
        >
          { isEdit ? '編集' : '追加'}
        </Button>
      </VStack>
    </form>
  )
};

export default ReceptionDonForm;
