import React, { Fragment, useContext, useState } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import moment from 'moment';
import 'moment/locale/fr';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth';
import './message-card.css';

//createDirectMessage(conversationId: ID!, directMessageInput: DirectMessageInput): Conversation!
//deleteDirectMessage(conversationId: ID!, directMessageId: ID!): String!

const DELETE_DIRECT_MESSAGE = gql`
    mutation DeleteDirectMessage($conversationId: ID!, $directMessageId: ID!){
        deleteDirectMessage(conversationId: $conversationId, directMessageId: $directMessageId){
            id
            messages {
                id
                content
            }
        }
    }
`;

/* const CREATE_DIRECT_MESSAGE = gql`
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
`; */

const MessageCard = ({conversationId,  message: { id, from, to, createdAt, content, seen }, fromUser, deleteMessage }) => {
    moment.locale('fr');
    const { user } = useContext(AuthContext);
    const [focused, setFocused] = useState(false);
    const [deleteDirectMessage, { data, error }] = useMutation(DELETE_DIRECT_MESSAGE, {
        variables: {
            conversationId: conversationId,
            directMessageId: id
        }
    });

    if(data) console.log(data);

    /* const [createDirectMessage, {error}] = useMutation(CREATE_DIRECT_MESSAGE, {
        variables:{
            conversationId: conversationId,
            directMessageInput: {
            content: messageContent,
            from: user.username,
            to: recipient
            }
        }
    }); */

    const supprimerMessage = async () => {
        console.log("Suppression du message (" + id + ')');
        try{
            const res = await deleteDirectMessage();
            deleteMessage(id);
            console.log(res);
        }catch(err){
            alert("Une erreur est survenue lors de la suppression du message !");
        }
    }

    const userMessage = fromUser && (
        <div data-testid='direct-message-from-user' tabIndex='0' onFocus={() => setFocused(true) } onBlur={() => setFocused(false)} className='flexColRight' >
            <div className='messageContentUser' >
                {content}
            </div>
            {
                focused ? (
                    <div className='spaceAround' >
                        <div className='deleteBtn' onClick={() => supprimerMessage() } >
                            Supprimer
                        </div>
                        <div className='graySmallText' >
                            {`${moment(createdAt).fromNow(true)} - ${seen ? 'Vu' : 'Envoyé'}`}
                        </div>
                    </div>
                ) : (
                    <div className='graySmallText' >
                        {`${moment(createdAt).fromNow(true)} - ${seen ? 'Vu' : 'Envoyé'}`}
                    </div>
                )
            }
        </div>
    );

    const recipientMessage = !fromUser && (
        <div data-testid='direct-message-from-recipient' className='flexRowCenter' >
            <Image
                floated='left'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                rounded
            />
            <div className='flexColLeft' >
                <div className='messageContentRecipient' >
                    {content}
                </div>
                <div className='graySmallText' >
                    {moment(createdAt).fromNow(true)}
                </div>
            </div>
        </div>
    );

    return (
        <Fragment>
            {userMessage}
            {recipientMessage}
        </Fragment>
    )
}

export default MessageCard;