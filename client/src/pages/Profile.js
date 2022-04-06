import React, { useContext, useState } from 'react';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import { Grid, Transition } from 'semantic-ui-react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import moment from 'moment';

const GET_POSTS_USER = gql`
    query GetPostsFrom($username: String!){
        getPostsFrom(username: $username){
            id
            body
            username
            createdAt
            comments {
                id
                username
                body
                createdAt
            }
            likes {
                id
                username
                createdAt
            }
            likeCount
            commentCount
        }
    }
`;

const GET_USER_INFOS = gql`
    query GetUserInfos($username: String!){
        getUserInfos(username: $username) {
            id
            username
            email
            createdAt
        }
    }
`;

const GET_CONVERSATION_BETWEEN =gql`
  query GetConversationBetween($username1: String!, $username2: String!){
    getConversationBetween(username1: $username1, username2: $username2){
      id
      user1
      user2
      lastMessageDate
      messages {
        from
        to
        content
        createdAt
      }
    }
  }
`;

const Profile = () => {
    const { username } = useParams();
    const { user: me } = useContext(AuthContext);
    const [postsUser, setPostsUser] = useState([]);
    const [user, setUser] = useState(null);
    const [conversationId, setConversationId] = useState("");
    const { loading: loadingPosts   , data: userPosts } = useQuery(GET_POSTS_USER, {
        variables: {
            username: username
        }
    });
    const { loading: loadingInfos   , data: userInfos } = useQuery(GET_USER_INFOS, { variables: { username } });
    const { loading: loadingConversation, data: dataConversation } = useQuery(GET_CONVERSATION_BETWEEN, {
        variables:{
          username1: username,
          username2: me ? me.username : ""
        }
    });

    if(userPosts && postsUser.length === 0){
        setPostsUser(userPosts.getPostsFrom);
    }

    if(userInfos && user === null){
        setUser(userInfos.getUserInfos);
    }

    //Si une conversation entre les deux utilisateurs a déjà été enregistrée, on récupère son id
    if(conversationId === '' && dataConversation){
        console.log(dataConversation);
        let newConversationId = 'new';
        if(dataConversation.getConversationBetween !== null && dataConversation.getConversationBetween !== undefined){
            newConversationId = dataConversation.getConversationBetween.id;
        }
        console.log(newConversationId);
        setConversationId(newConversationId);
    }

    return (
        user ? (
            <Grid columns={3}>
                <Grid.Row centered >
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Image
                                floated='left'
                                size='mini'
                                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                                />
                                <Card.Header as={Link} to={`/profile/${username}`} >{username}</Card.Header>
                                <Card.Meta as={Link} to={`/profile/${username}`} >Inscrit(e) depuis : {moment(user.createdAt).fromNow(true)}</Card.Meta>
                            </Card.Content>
                            <Card.Content textAlign='center' extra>
                                {
                                    (me && me.username !== username) ? (
                                        <Popup content="Discuter" inverted trigger={
                                            <Button labelPosition='right' as={Link} to={`/single-conversation/${conversationId}`} state={{recipient: username}} >
                                                <Button icon color='blue' basic>
                                                    <Icon name='comments' />
                                                </Button>
                                                <Label basic color='blue' pointing='left'>
                                                    Discuter
                                                </Label>
                                            </Button>
                                        } 
                                        />
                                    )
                                    :
                                    null
                                }
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row centered >
                    <Grid.Column>
                        {loadingPosts ? (
                            <h1>Chargement des posts ...</h1>
                            ) : (
                            <Transition.Group>
                                {
                                postsUser && postsUser.map(post => (
                                    <Grid.Row key={post.id} style={{ marginBottom: 20 }} >
                                        <PostCard post={post}/>
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
  )
}

export default Profile;