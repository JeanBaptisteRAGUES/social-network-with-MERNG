import React, { useContext } from 'react';
import { gql, useQuery } from '@apollo/client';

import { AuthContext } from '../../context/auth';



function TestPage() {
  const { username } = useContext(AuthContext);
  console.log(username);

  return (
    <div>
      Salut
    </div>
  );
}

export default TestPage;