import React, { useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

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

export function Dog({ name }) {
  const { username } = useContext(AuthContext);
  console.log(username);
  /*
  const { loading, error, data } = useQuery(
    GET_DOG_QUERY,
    { variables: { name } }
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;
  */

  return (
    <div>
      <p>
        {
          `Owner name is ${username}`
        }
      </p>
      {/* <p>
        {data.dog.name} is a {data.dog.breed}
      </p> */}
    </div>
  );
}