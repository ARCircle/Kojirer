import { Box, Heading, Center } from '@chakra-ui/react'

const SelectDon = () => {
  return (
    <Box>
      <Center>丼の注文内容をここで決める</Center>
    </Box>
  )
}

const Uketuke: React.FC = () => {
  return (
    <>
      <Heading>受付画面</Heading>
      <SelectDon />
    </>
  )
}

export default Uketuke

