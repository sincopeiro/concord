import { Input, Button, Box, Wrap, Spacer, InputGroup, InputLeftElement, Text } from '@chakra-ui/react'

import { EmailIcon, LockIcon } from '@chakra-ui/icons'

import AuthenticationCard from '../components/AuthenticationCard'

function SignUp() {
  return (
    <AuthenticationCard>
      <Box textAlign="left" marginBottom="27px">
      <Text marginBottom="15px" fontWeight="600" fontSize="18px">Join thousands of learners from around the world </Text>
      <Text fontSize="16px">Master web development by making real-life projects. There are multiple paths for you to choose</Text>
      </Box>
      <Spacer />
      <Wrap spacing="14px" marginBottom="22px" display="flex">
        <InputGroup>
          <InputLeftElement children={<EmailIcon />} />
          <Input placeholder='Email' />
        </InputGroup>
        <InputGroup>
          <InputLeftElement children={<LockIcon />} />
          <Input placeholder='Password' type="password"/>
        </InputGroup>
      </Wrap>
      <Button colorScheme='blue' width="100%" marginBottom="31px">Start chatting now</Button>
    </AuthenticationCard>
  )
}

export default SignUp