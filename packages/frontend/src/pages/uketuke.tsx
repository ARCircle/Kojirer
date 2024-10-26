import { Box, Heading, Center, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'

type OptionProps = {
  name: string,
  items: string[]
}

const SelectOption: React.FC<OptionProps> = ({ name, items }) => {
  return (
    <Menu>
      <MenuButton as={Button}>
        {name}
      </MenuButton>
      <MenuList>
        {items.map(name => (
          <MenuItem key={name}>{name}</MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

const SelectDon = () => {
  return (
    <Box border='2px'>
      <Center>丼の注文内容をここで決める</Center>
      <SelectOption name="カラメ" items={['無', '並', 'マシ', 'マシマシ']} />
      <SelectOption name="アブラ" items={['無', '並', 'マシ', 'マシマシ']} />
      <SelectOption name="にんにく" items={['無', '並', 'マシ', 'マシマシ']} />
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

