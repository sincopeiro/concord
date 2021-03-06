import { Box, Text } from '@chakra-ui/react';
import Avatar from 'components/Avatar';

type Props = {
  name: string;
};

function SidebarItem({ name }: Props) {
  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      key={name}
    >
      <Avatar name={name} />
      <Text>{name}</Text>
    </Box>
  );
}

export default SidebarItem;
