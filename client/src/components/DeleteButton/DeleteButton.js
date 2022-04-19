import React, { useState } from 'react'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../../utils/graphql';

const DeleteButton = ({ postId, commentId, callback }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy, result){
            setConfirmOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                const updatedPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery( { query: FETCH_POSTS_QUERY, data: { getPosts: [...updatedPosts] } } );
            }
            if(callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>  <Popup content="Supprimer" inverted trigger={
                <Button
                    data-testid='deletebutton' 
                    as="div" 
                    color='red' 
                    floated='right'
                    onClick={() => setConfirmOpen(true)}
                >
                    <Icon name='trash' style={{margin: 0}} />
                </Button>
            }
            />
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrComment}
            />
        </>
    )
}

export const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`;

export const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments {
                id
                username
                createdAt
                body
            }
            commentCount
        }
    }
`;

export default DeleteButton;