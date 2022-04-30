import React, { useContext } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';

import { AuthContext } from '../../context/auth';

// Make sure that both the query and the component are exported
export const GET_DOG_QUERY = gql`
  query GetDog($name: String) {
    dog(name: $name) {
      id
      name
      breed
    }
  }
`;

export const DELETE_DOG_MUTATION = gql`
  mutation deleteDog($name: String!){
    deleteDog(name: $name){
      id
      name
      breed
    }
  }
`;

export function Dog({ name }) {
  const { username } = useContext(AuthContext);
  const [mutate, {loading: loadingDelete, error: errorDelete, data: dataDelete }] = useMutation(DELETE_DOG_MUTATION);
  const { loading, error, data } = useQuery(
    GET_DOG_QUERY,
    { variables: { name } }
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error !</p>;
 

  return (
    <div>
      { dataDelete ? <p>Deleted !</p> : null}
      <p>
        {
          `Owner name is ${username}`
        }
      </p>
      <p>
        {data.dog.name} is a {data.dog.breed}
      </p>
      <button onClick={() => mutate({ variables: {name: 'Buck'} })}>
        Click to delete Buck
      </button>
    </div>
  );
}