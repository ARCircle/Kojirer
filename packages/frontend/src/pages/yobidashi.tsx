import { Grid, GridItem, HStack, Text, Box, Heading } from '@chakra-ui/react'

type TableProps = {
  n: number
}

const Card: React.FC<{ text: string }> = ({ text }) => (
  <Text color='white' pos='absolute' top='50%' left='50%' transform='translate(-50%,-50%)' fontSize='xxx-large'>
    {text}
  </Text>
)


function YobidashiTable({ n }: TableProps) {
  return (
    <Grid templateColumns='repeat(3, 1fr)' gap={6} pt='20px'>
      {Array(n).fill(
        <GridItem width='100%' height='20' bg='blue.500' borderRadius='md' pos='relative'>
          <Card text={n.toString()} />
        </GridItem>
      )}
    </Grid>
  )
}

const Yobidashi = () => {
  return (
    <>
      <Heading textAlign='center' fontSize='xxx-large'>呼び出し口画面</Heading>
      <HStack spacing={4} w='100%' p='10px'>
        <Box w='70%' border='2px' borderColor='black' p='20px'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>調理中</Heading>
          <YobidashiTable n={17}/>
        </Box>
        <Box w='30%' border='2px' borderColor='black' p='20px' verticalAlign='top'>
          <Heading textAlign='center' borderRadius='md' w='fit-content' mx='auto' fontSize='xxx-large'>呼出中</Heading>
          <YobidashiTable n={4}/>
        </Box>
      </HStack>
    </>
  );
}

export default Yobidashi;
