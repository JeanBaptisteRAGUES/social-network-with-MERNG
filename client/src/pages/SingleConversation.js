import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';

import { AuthContext } from '../context/auth';
import MessageCard from '../components/MessageCard';
import { Button, Form } from 'semantic-ui-react';

const LISTEN_CONVERSATIONS_UPDATES = gql`
  subscription ListenConversationsUpdates($conversationId: ID!){
    conversationUpdated(conversationId: $conversationId) {
      id
      user1
      user2
      lastMessageDate
      messages {
        content
        from
        to
        createdAt
      }
    }
  }
`;

const GET_CONVERSATION = gql`
  query Get_Conversation($conversationId: ID!){
    getConversation(conversationId: $conversationId) {
      id
      user1
      user2
      lastMessageDate
      messages {
        id
        content
        from
        to
        createdAt
      }
    }
  }
`;

const CREATE_DIRECT_MESSAGE = gql`
  mutation CreateDirectMessage($conversationId: ID!, $directMessageInput: DirectMessageInput!){
    createDirectMessage(conversationId: $conversationId, directMessageInput: $directMessageInput){
      id
      user1
      user2
      lastMessageDate
      messages {
        id
        content
        from
        to
        createdAt
      }
    }
  }
`;

const SingleConversation = () => {
  const { conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [recipient, setRecipient] = useState('');
  const [createDirectMessage, {error}] = useMutation(CREATE_DIRECT_MESSAGE, {
    variables:{
      conversationId: conversationId,
      directMessageInput: {
        content: messageContent,
        from: user.username,
        to: recipient
      }
    }
  });
  const { loading: loadingConversation, data: dataConversation } = useQuery(GET_CONVERSATION, {
    variables:{
      conversationId: conversationId
    }
  });
  const { dataUpdate, loadingUpdate } = useSubscription(
    LISTEN_CONVERSATIONS_UPDATES,
    {
        variables:{
          conversationId: conversationId
        },
        onSubscriptionData: (dataUpdate) => {
            const conversation = dataUpdate.subscriptionData.data.conversationUpdated;
            console.count("Message(s) reçu(s) ");
            setMessages(conversation.messages);
        }
    }
  );

  if(messages.length === 0 && !loadingConversation){
    console.log(loadingConversation);
    console.log(dataConversation.getConversation);
    setMessages(dataConversation.getConversation.messages);
    setRecipient([dataConversation.getConversation.user1, dataConversation.getConversation.user2].find(u => u !== user.username));
  }

  const sendDirectMessage = (e) => {
    e.preventDefault();
    if(conversationId !== null){
      createDirectMessage();
    }else{
      //TODO: createConversation();
    }
    setMessageContent('');
  }



  return (
    <div style={{ height: "90vh",width: '80vw',  display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
      <div style={{display: 'flex', flexDirection: 'column-reverse', width: '100%', overflow: 'auto', margin: '5px'}} >
        { 
          (!loadingConversation && messages.length > 0) ?
            messages.map((message, i) => {
              const fromUser = message.from === user.username;
              return (
              <div key={message.id ? message.id : i } style={ fromUser ? { width: 'auto', maxWidth: 400 , margin: '0 5px 10px 5px' , alignSelf: 'end' } : { width: 'auto', maxWidth: 400 , marginBottom: 20, marginLeft: 5, alignSelf: 'start' }} >
                <MessageCard message={message} fromUser={fromUser} />
              </div>
              )
            })
          : 
          "Chargement.." 
        }
      </div>
      <Form onSubmit={(e) => sendDirectMessage(e)} style={{ width: '100%', height: '35px',  display: 'flex', flexDirection: 'row'}} >
        <Form.Field style={{ width: '85%' }} >
          <input placeholder='Message..' value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
        </Form.Field>
        <Button fluid style={{ width: '15%' }} type='submit'>Envoyer</Button>
      </Form>
    </div>
  )
}

export default SingleConversation;