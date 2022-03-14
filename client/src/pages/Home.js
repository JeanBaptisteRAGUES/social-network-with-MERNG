import React from 'react';
import { useQuery, gql } from "@apollo/client";
import { Grid, Image } from 'semantic-ui-react';

import PostCard from '../components/PostCard';

const Home = () => {
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  let posts = [];

  if(data){
    posts = data.getPosts;
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title' >
        <h1>Recent posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts ...</h1>
        ) : (
          posts && posts.map(post => (
            <Grid.Column key={post.id} style={{ marginBottom: 20 }} >
              <PostCard post={post}/>
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  )
}

/*

*/

const FETCH_POSTS_QUERY = gql`
  {
    getPosts{
      id
      body
      createdAt
      username
      likeCount
      likes{
        username
      }
      commentCount
      comments{
        id
        username
        createdAt
        body
      }
    }
  }
`

export default Home;