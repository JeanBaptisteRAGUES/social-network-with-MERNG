import React, { useState } from 'react';
import { gql, useMutation, useSubscription } from '@apollo/client';

import { AuthContext } from '../context/auth';
import ConversationForm from '../components/ConversationForm';

const LISTEN_NEW_CONVERSATIONS = gql`
  subscription ListenNewConversations{
    conversationCreated {
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

const LISTEN_CONVERSATIONS_UPDATES = gql`
  subscription ListenConversationsUpdates{
    conversationUpdated {
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

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const { dataCreation, loadingCreation } = useSubscription(
    LISTEN_NEW_CONVERSATIONS,
    {
        onSubscriptionData: (dataCreation) => {
            const conversation = dataCreation.subscriptionData.data.conversationCreated;
            console.count("Conversation(s) reçue(s) ");
            console.log(dataCreation);
            console.log(conversation);
            setConversations([conversation, ...conversations]);
        }
    }
  );
  const { dataUpdate, loadingUpdate } = useSubscription(
    LISTEN_CONVERSATIONS_UPDATES,
    {
        onSubscriptionData: (dataUpdate) => {
            const conversation = dataUpdate.subscriptionData.data.conversationUpdated;
            console.count("Conversation(s) reçue(s) ");
            setConversations([conversation, ...conversations]);
        }
    }
  );

  const conversationsList = conversations.length > 0 && (
    <div>
      {
        conversations.map((conversation) => (
          <span key={conversation.id} >
            <p>
              Conversation ({`${conversation.user1} / ${conversation.user2}`}) : <br/>
              {conversation.messages[0].from} ({conversation.lastMessageDate}) :<br/>
              {conversation.messages[0].content}
            </p>
          </span>
        ))
      }
    </div>
  )

  return (
    <div>
      Conversations :
      <ConversationForm/>
      {conversationsList}
    </div>
  )
}

export default Conversations;