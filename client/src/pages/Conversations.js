import React, { useContext, useState } from 'react';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Grid, Transition } from 'semantic-ui-react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import ConversationForm from '../components/ConversationForm';
import ConversationCard from '../components/ConversationCard';

const GET_CONVERSATIONS = gql`
  query GetConversations($username: String!){
    getConversations(username: $username){
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
        seen
      }
    }
  }
`;

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
        seen
      }
    }
  }
`;

const Conversations = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const { loading: loadingConversations, data: dataConversations } = useQuery(GET_CONVERSATIONS, {
    variables:{
      username: user.username
    }
  })
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
        variables:{
          conversationId: "624a0c62ffaed435afd51ed9"
        },
        onSubscriptionData: (dataUpdate) => {
            const conversation = dataUpdate.subscriptionData.data.conversationUpdated;
            console.count("Message(s) reçu(s) ");
            setConversations([conversation, ...conversations]);
        }
    }
  );

  if(conversations.length === 0 && dataConversations){
    console.log(dataConversations.getConversations);
    setConversations(dataConversations.getConversations);
  }

  return (
    <div>
      {
        user ? (
          <Grid columns={3}>
              <Grid.Row centered >
                  <Grid.Column>
                      {loadingConversations ? (
                          <h1>Chargement des conversations ...</h1>
                          ) : (
                          <Transition.Group>
                              {
                              conversations.length > 0 && conversations.map(conv => (
                                  <Grid.Row key={conv.id} style={{ marginBottom: 20 }} >
                                      <ConversationCard conversation={conv} />
                                  </Grid.Row>
                              ))
                              }
                          </Transition.Group>
                          )
                      }
                  </Grid.Column>
              </Grid.Row>
          </Grid>
        )
        :
        (
            <div>
                <h1>Chargement des données..</h1>
            </div>
        )
      }
    </div>
  )
}

export default Conversations;