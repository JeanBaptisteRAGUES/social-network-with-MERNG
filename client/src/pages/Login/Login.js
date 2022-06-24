import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../utils/hooks';
import { AuthContext } from '../../context/auth';

const Login = (props) => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { onChange, onSubmit, values } = useForm(loginUserCallback, {
    username: '',
    password: ''
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }){
      context.login(userData);
      navigate('/');
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function loginUserCallback() {
    loginUser();
  }

  // Uncomment the next line if you want to test boundary errors when trying to login
  // throw Error('Erreur Login');

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
        <h1>Connexion</h1>
        <Form.Input
          label="Pseudo"
          placeholder="Pseudo.."
          name="username"
          type='text'
          value={values.username}
          error={errors.username}
          onChange={onChange}
        />
        <Form.Input
          label="Mot de passe"
          placeholder="Mot de passe.."
          name="password"
          type='password'
          value={values.password}
          error={errors.password}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Connexion
        </Button>
      </Form>
      {
        Object.keys(errors).length > 0 && (
          <div className='ui error message'>
            <ul className='list'>
              {Object.values(errors).map(value => (
                <li key={value} >{value}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  )
}

const LOGIN_USER = gql`
  mutation login(
    $username: String!
    $password: String!
  ){
    login(
      username: $username
      password: $password
    ){
      id email username createdAt token
    }
  }
`

export default Login;