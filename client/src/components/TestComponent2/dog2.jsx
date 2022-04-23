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

export function Dog2({ name }) {
  const { username } = useContext(AuthContext);
  console.log(username);

  return (
    <div>
      Salut
    </div>
  );
}