import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Button, Form, Transition } from 'semantic-ui-react';

import { AuthContext } from '../../context/auth';
import MessageCard from '../../components/MessageCard';

const LISTEN_CONVERSATIONS_UPDATES = gql`
  subscription ListenConversationsUpdates($conversationId: ID!){
    conversationUpdated(conversationId: $conversationId) {
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
        seen
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
        seen
      }
    }
  }
`;

const CREATE_CONVERSATION = gql`
  mutation CreateConversation($directMessageInput: DirectMessageInput){
    createConversation(directMessageInput: $directMessageInput) {
      id
      user1
      user2
      lastMessageDate
      messages {
        content
        from
        to
        createdAt
        seen
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
        seen
      }
    }
  }
`;

const SET_DM_AS_SEEN = gql`
  mutation SetMessagesAsSeen($conversationId: ID!, $recipient: String!){
    setMessagesAsSeen(conversationId: $conversationId, recipient: $recipient){
      id
      messages {
        id
        content
        from
        to
        createdAt
        seen
      }
    }
  }
`;

const SingleConversation = (props) => {
  const { conversationId } = useParams();
  const { state: {recipient} } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
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
  const [createConversation, {data: dataCreation, error: errorCreation}] = useMutation(CREATE_CONVERSATION, {
    variables:{
      directMessageInput: {
        content: messageContent,
        from: user.username,
        to: recipient
      }
    }
  });
  const [setMessagesAsSeen, {data: dataSeen, error: errorSeen}] = useMutation(SET_DM_AS_SEEN, {
    variables:{
      conversationId: conversationId,
      recipient: recipient
    }
  });
  const { loading: loadingConversation, data: dataConversation } = useQuery(GET_CONVERSATION, {
    variables:{
      conversationId: conversationId
    },
    fetchPolicy: 'network-only'
  });
  const { dataUpdate, loadingUpdate } = useSubscription(
    LISTEN_CONVERSATIONS_UPDATES,
    {
        variables:{
          conversationId: conversationId,
          username: ''
        },
        onSubscriptionData: (dataUpdate) => {
            const conversation = dataUpdate.subscriptionData.data.conversationUpdated;
            console.count("Message(s) reçu(s) ");
            setMessages(conversation.messages);
        }
    }
  );

  if( conversationId !== 'new' && messages.length === 0 && dataConversation){
    console.log("loadingConversation");
    console.log(dataConversation.getConversation);
    setMessages(dataConversation.getConversation.messages);
    setMessageContent('');
  }

  const checkUnreadMessages = () => {
    return messages.some(m => m.to === user.username && !m.seen);
  }

  useEffect(() => {
    if(checkUnreadMessages()){
      const dmSeen = setMessagesAsSeen();
      console.log(dmSeen);
    }
  }, [messages]);

  const deleteMessage = (id) => {
    console.log(`Suppression du message (${id}) de la conversation`)
    const messagesCopy = [...messages];
    const newMessagesList = messagesCopy.filter(m => m.id !== id);
    setMessages(newMessagesList);
  }

  const sendDirectMessage = (e) => {
    e.preventDefault();
    if(conversationId === 'new'){
      createConversation().then(res => {
        console.log(res);
        const newConversation = res.data.createConversation;
        navigate(`/single-conversation/${newConversation.id}`, { state: {recipient: recipient} });
      })
    }else{
      createDirectMessage();
      setMessageContent('');
    }
  }



  return (
    <div style={{ height: "90vh",width: '80vw',  display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} >
      <div style={{display: 'flex', flexDirection: 'column-reverse', width: '100%', overflow: 'auto', margin: '5px'}} >
        { 
          (!loadingConversation && messages.length > 0) ?
            <Transition.Group>
              {
                messages.map((message, i) => {
                  const fromUser = message.from === user.username;
                  return (
                  <div key={message.id ? message.id : i } style={ fromUser ? { width: 'auto', maxWidth: 400 , margin: '0 5px 10px 5px' , alignSelf: 'end' } : { width: 'auto', maxWidth: 400 , marginBottom: 20, marginLeft: 5, alignSelf: 'start' }} >
                    <MessageCard conversationId={conversationId} message={message} fromUser={fromUser} deleteMessage={deleteMessage} />
                  </div>
                  )
                })
              }
            </Transition.Group>
          : 
            <p style={{alignSelf: 'center'}} >Aucun message pour l'instant</p>
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