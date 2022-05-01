import React, { useContext, useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { gql, useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';

import { useForm } from '../../utils/hooks';
import { AuthContext } from '../../context/auth';

export const Register = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const { onChange, onSubmit, values } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }){
      context.login(userData);
      navigate('/');
    },
    onError(err){
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values
  });

  function registerUser(){
    addUser();
  }

  return (
    <div className='form-container'>
      <h1>Inscription</h1>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
        <Form.Input
          data-testid="username"
          label="Pseudo"
          placeholder="Pseudo.."
          name="username"
          type='text'
          value={values.username}
          error={errors.username}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type='email'
          value={values.email}
          error={errors.email}
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
        <Form.Input
          label="Confirmation mot de passe"
          placeholder="Confirmation mot de passe.."
          name="confirmPassword"
          type='password'
          value={values.confirmPassword}
          error={errors.confirmPassword}
          onChange={onChange}
        />
        <Button type="submit" primary>
          S'inscrire
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

export const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ){
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ){
      id email username createdAt token
    }
  }
`;