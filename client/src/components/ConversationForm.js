import React, { useContext, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '../context/auth';

/*
const CREATE_MESSAGE = gql`
    mutation CreateMessage($messageInput: MessageInput) {
        createMessage(messageInput: $messageInput){
            text
            createdBy
        }
    }
`;
*/

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
            }
        }
    }
`;

const ConversationForm = () => {
    const { user } = useContext(AuthContext);
    const [recipient, setRecipient] = useState('');
    const [content, setContent] = useState('');

    const [createConversation, { data, loading, error }] = useMutation(CREATE_CONVERSATION, {
        variables: {
            directMessageInput: {
                "content": content,
                "from": user.username,
                "to": recipient
            }
        },
    });

    const createTemplateConversation = (e) => {
        e.preventDefault();
        createConversation();
        setRecipient('');
        setContent('');
        console.count('Conversation(s) créée(s) : ');
    }

    if(error) console.log(error);

    return (
        <form onSubmit={(e) => createTemplateConversation(e)} >
            <div>
                <label htmlFor='recipient' >Destinataire : </label>
                <input 
                    id='recipient' 
                    name='recipient' 
                    type='text' 
                    placeholder='' 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)} >
                </input>
            </div>
            <div>
                <label htmlFor='content' >Message :</label><br/>
                <textarea 
                    id='content' 
                    name='content' 
                    rows='5' 
                    cols='35' 
                    placeholder='Votre message ici..' 
                    value={content}
                    onChange={(e) => setContent(e.target.value)} > 
                </textarea>
            </div>
            <button>Ajouter une conversation</button>
        </form>
    )
}

export default ConversationForm;