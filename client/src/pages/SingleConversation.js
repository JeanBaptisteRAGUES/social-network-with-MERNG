import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';

import { AuthContext } from '../context/auth';
import MessageCard from '../components/MessageCard';

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

const SingleConversation = () => {
  const { conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
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
  }

  return (
    <div>
      <h1>{conversationId}</h1>
      { 
        (!loadingConversation && messages.length > 0) ?
           messages.map(message => (
            <div key={message.id} style={{width: 400, marginBottom: 20}} >
              <MessageCard message={message}/>
            </div>
           ))
        : 
        "Chargement.." 
      }
    </div>
  )
}

export default SingleConversation;