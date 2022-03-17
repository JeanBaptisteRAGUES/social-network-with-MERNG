import React, { Fragment } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from "@apollo/client";

import { useForm } from '../utils/hooks';
import { FETCH_POSTS_QUERY } from '../utils/graphql';

const PostForm = () => {

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data:{
                    getPosts:[result.data.createPost, ...data.getPosts],
                },
            })
            values.body = '';
        }
    });

    function createPostCallback(){
        createPost();
    }

    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
                <h2>Créer un post :</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Écrivez votre message ici.."
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error}
                    />
                    <Button type='submit' color="teal" >Valider</Button>
                </Form.Field>
            </Form>
            {
                error && (
                    <div className='ui error message' style={{marginBottom: 20}} >
                        <ul className='list' >
                            <li>{error.graphQLErrors[0].message}</li>
                        </ul>
                    </div>
                )
            }
        </Fragment>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm;