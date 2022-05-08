import React, { useContext, useState } from 'react';
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

/* export const DELETE_DOG_MUTATION = gql`
  mutation deleteDog($name: String!){
    deleteDog(name: $name){
      id
      name
      breed
    }
  }
`; */

/* export const DELETE_DOG_MUTATION = gql`
  mutation deleteDog($name: String!, $breed: String!){
    deletedDog( dogInput: {name: $name, breed: $breed}){
      id
      name
      breed
    }
  }
`; */

//deleteDog = fonction, deletedDog = resultat (?)
export const DELETE_DOG_MUTATION = gql`
  mutation deleteDog(
    $name: String!
    $breed: String!
  ){
    deletedDog(
      dogInput: {
        name: $name
        breed: $breed
      }
    ){
      id name breed
    }
  }
`;

export function Dog({ name }) {
  const { username } = useContext(AuthContext);
  const [errors, setErrors] = useState([]);
  const [mutate, {loading: loadingDelete, error: errorDelete, data: dataDelete }] = useMutation(DELETE_DOG_MUTATION);
  const { loading, error, data } = useQuery(
    GET_DOG_QUERY,
    { variables: { name } }
  );

  const testMutate = async () => {
    try{
      const res = await mutate({ 
        variables: {name: 'Buck', breed: 'poodle'} 
      });

      if(res.data?.deletedDog) console.log(res.data.deletedDog);
    }catch(err){
      console.log(JSON.stringify(err));
      setErrors(errors.push(err));
    }
  }

  const errorsDisplay = errors.length > 0 && errors.map(err => (
    <p>{"Error: " + err}</p>
  ));

  const errorQueryDisplay = error && (
    <p>{`Query error : ${error.message}`}</p>
  )

  const errorMutationDisplay = errorDelete && (
    <p>{`Mutation error : ${errorDelete.message}`}</p>
  )

  const dogDisplay = !loading && data && (
    <p>
      {data.dog.name} is a {data.dog.breed}
    </p>
  );

  const loadingDisplay = loading && (
    <p>Loading...</p>
  );

  if(dataDelete) console.log(dataDelete);
 

  return (
    <div>
      { dataDelete ? <p>Deleted ! ({`Id: ${dataDelete.deletedDog.id}, Name: ${dataDelete.deletedDog.name}, Breed: ${dataDelete.deletedDog.breed}`})</p> : null}
      {errorQueryDisplay}
      {errorMutationDisplay}
      {errorsDisplay}
      <p>
        {
          `Owner name is ${username}`
        }
      </p>
      {dogDisplay}
      {loadingDisplay}
      <button onClick={testMutate}>
        Click to delete Buck
      </button>
    </div>
  );
}