import { Grid, GridItem, Stack } from '@chakra-ui/layout';
import {
  Text,
  Box,
  Image,
  Button,
  Input,
  InputRightElement,
  InputGroup,
  Icon,
} from '@chakra-ui/react';
import RequireAuth from '../hocs/RequireAuth';

import { IoMdSend } from 'react-icons/io';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import SideTab from '../components/SideTab';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ChatMessage from '../components/ChatMessage';
import { Message } from '../types/Message';
import useAuth from '../hooks/useAuth';
import { User } from '../types/User';

import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import api from '../api';
import { Room } from '../types/Room';
const socket = io('http://localhost:9999');

type Tabs = 'CurrentChannel' | 'AllChannels';

function Chat() {
  const { user }: { user: User } = useAuth();

  let [searchParams, setSearchParams] = useSearchParams();

  console.log(searchParams.get('room'));

  const [currentTab, setCurrentTab] = useState<Tabs>('AllChannels');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([] as Message[]);
  const [room, setRoom] = useState<Room>([] as Room);
  const [rooms, setRooms] = useState<[Room]>();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = api.get('/chat/rooms');
        setRooms(response as [Room]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRooms();
  });

  useEffect(() => {
    !!searchParams.get('room')
      ? setRoom(searchParams.get('room') as string)
      : setRoom('welcome');
  }, [searchParams]);

  socket.on('previous-messages', (messages) => {
    console.log(messages);
    setMessages(messages);
  });

  const joinRoom = (room: string) => {
    socket.emit('join-room', room);
  };

  const handleMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = () => {
    const newMessage = {
      message,
      author: user._id as string,
      timestamp: new Date(),
    };
    socket.emit('send-message', newMessage, room);
    setMessages((prevState) => [...prevState, newMessage]);
    setMessage('');
  };

  const displayMessage = ({ message, author, timestamp }: Message) => {
    setMessages((prevState) => [...prevState, { message, author, timestamp }]);
  };

  socket.on('received-message', (message) => {
    displayMessage(message);
  });

  return (
    <RequireAuth>
      <Grid templateColumns='repeat(10, 1fr)' minH='100vh'>
        <SideTab currentTab={currentTab} />
        <GridItem colSpan={8} bg='gray.700'>
          <Grid templateRows='repeat(24, 1fr)' minH='100vh'>
            <GridItem
              rowSpan={2}
              p='0px 22px 0px 70px'
              boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              height='100%'
            >
              <Text fontWeight='700' fontSize='18px'>
                FRONT-END DEVELOPERS
              </Text>
              <ColorModeSwitcher />
            </GridItem>
            <GridItem rowSpan={2} />
            <GridItem rowSpan={18} p='0px 22px 0px 70px'>
              {messages.map(({ message, timestamp, author }) => (
                <ChatMessage
                  message={message}
                  key={message}
                  timestamp={timestamp}
                  author={author}
                />
              ))}
              <Stack flexDirection='row' alignItems='center' margin='40px 0px'>
                {/* <Divider orientation='horizontal' />
                <Text margin='20px' whiteSpace='nowrap'>
                  August 3, 2020
                </Text>
                <Divider orientation='horizontal' /> */}
              </Stack>
            </GridItem>
            <GridItem
              rowSpan={2}
              alignSelf='center'
              justifySelf='center'
              w='100%'
              p='0px 22px 0px 70px'
            >
              <InputGroup size='lg'>
                <Input
                  placeholder='Type a message here'
                  border='none'
                  bg='gray.600'
                  value={message}
                  onChange={handleMessage}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') sendMessage();
                  }}
                />
                <InputRightElement width='3rem'>
                  <Button
                    size='md'
                    boxSize='40px'
                    bgColor='blue.500'
                    onClick={sendMessage}
                  >
                    <Icon as={IoMdSend} />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </RequireAuth>
  );
}

export default Chat;
