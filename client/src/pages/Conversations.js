import React, { useContext, useEffect, useState } from 'react';
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

const LISTEN_NEW_CONVERSATIONS = gql`
  subscription ListenNewConversations{
    conversationCreated {
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

const LISTEN_CONVERSATIONS_UPDATES = gql`
  subscription ListenConversationsUpdates($conversationId: ID, $username: String){
    conversationUpdated(conversationId: $conversationId, username: $username) {
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
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const { loading: loadingConversations, data: dataConversations, refetch } = useQuery(GET_CONVERSATIONS, {
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
  //TODO: conversationId écrit en dur..
  const { dataUpdate, loadingUpdate } = useSubscription(
    LISTEN_CONVERSATIONS_UPDATES,
    {
        variables:{
          conversationId: "",
          username: user.username
        },
        fetchPolicy: 'network-only',
        onSubscriptionData: (dataUpdate) => {
          const conversation = dataUpdate.subscriptionData.data.conversationUpdated;
          console.count("Message(s) reçu(s) ");
          let newConversations = [...conversations];
          newConversations = newConversations.filter(newC => newC.id !== conversation.id);
          newConversations.unshift(conversation);
          setConversations(newConversations);
        }
    }
  );

  useEffect(() => {
    refetch()
    .then((res) => {
      const newConversations = JSON.stringify(res.data.getConversations);
      const oldConversations = JSON.stringify(conversations);
      if(newConversations !== oldConversations){
        setConversations(res.data.getConversations);
        //console.log('Update conversations !');
      }
    });
  }, []);

  if(conversations.length === 0 && dataConversations){
    //console.log('Get conversations !')
    if(dataConversations.getConversations.length > 0){
      setConversations(dataConversations.getConversations);
    }
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
                                    <Grid.Row key={conv.id + conv.messages.length} style={{ marginBottom: 20 }} >
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