import React, { useState } from 'react'
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../utils/graphql';

const DeleteButton = ({ postId, callback }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(proxy, result){
            setConfirmOpen(false);
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            const updatedPosts = data.getPosts.filter(p => p.id !== postId);
            proxy.writeQuery( { query: FETCH_POSTS_QUERY, data: { getPosts: [...updatedPosts] } } );
            if(callback) callback();
        },
        variables: {
            postId
        }
    })

    return (
        <>
            <Button 
                as="div" 
                color='red' 
                floated='right'
                onClick={() => setConfirmOpen(true)}
            >
                <Icon name='trash' style={{margin: 0}} />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

export default DeleteButton;