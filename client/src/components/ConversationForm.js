import React from 'react';
import { gql, useMutation } from '@apollo/client';

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
    const [createConversation, { data, loading, error }] = useMutation(CREATE_CONVERSATION, {
        variables: {
            directMessageInput: {
                "content": "Test de conversation crée depuis le client",
                "from": "user",
                "to": "user9999"
            }
        },
    });

    const createTemplateConversation = () => {
        createConversation();
        console.log(data);
    }

    if(error) console.log(error);

    return (
        <div>
            <button onClick={() => createTemplateConversation()} >Ajouter une conversation</button>
        </div>
    )
}

export default ConversationForm;