import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import renderer from 'react-test-renderer';
import { GraphQLError } from 'graphql';
const { UserInputError } = require('apollo-server');

import Register, { REGISTER_USER} from './Register';
import { AuthProvider } from '../../context/auth';

/* const dogMocks = [
    {
        request: {
            query: GET_DOG_QUERY,
            variables: { name: 'Buck' },
        },
        result: {
            data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
        },
    },
    {
        request: {
            query: DELETE_DOG_MUTATION,
            variables: { name: 'Buck' },
        },
        result: {
            data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
        },
    }
]; */

/* const REGISTER_USER = gql`
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
` */



describe('Test form renders', function(){
    const mocks = [
        {
            request: {
                query: REGISTER_USER,
                variables: {
                    username: 'TestUser',
                    email: 'testuser@test.com',
                    password: '123456',
                    confirmPassword: '123456',
                },
            },
            result: {
                data: {
                    id: 'testid123',
                    email: 'testuser@test.com',
                    username: 'TestUser',
                    createdAt: '01-01-2022',
                    token: 'testjwt123',
                },
            },
        },
    ];

    const userDummy = {
        username: 'Jean'
    };

    beforeEach(() => {
        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
    });

    test('renders owner div without error', () => {
        const registerDivElem = screen.getByText(/inscription/i);
        expect(registerDivElem).toBeInTheDocument();
    });
});

describe('Test form inputs', function(){
    const mocks = [
        {
            request: {
                query: REGISTER_USER,
                variables: {
                    username: 'TestUser',
                    email: 'testuser@test.com',
                    password: '123456',
                    confirmPassword: '123456',
                },
            },
            result: {
                data: {
                    id: 'testid123',
                    email: 'testuser@test.com',
                    username: 'TestUser',
                    createdAt: '01-01-2022',
                    token: 'testjwt123',
                },
            },
        },
    ];

    const userDummy = {
        username: 'Jean'
    };

    beforeEach(() => {
        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
    });

    test('inputs should be initially empty', () => {
        const usernameInputElement = screen.getByPlaceholderText(/pseudo/i);
        const emailInputElement = screen.getByPlaceholderText(/email/i);
        const passwordInputElement = screen.getByPlaceholderText('Mot de passe..');
        const confirmPasswordInputElement = screen.getByPlaceholderText(/confirmation/i);
        expect(usernameInputElement.value).toBe('');
        expect(emailInputElement.value).toBe('');
        expect(passwordInputElement.value).toBe('');
        expect(confirmPasswordInputElement.value).toBe('');
    });
    
    test("should be able to type a username", () => {
        const usernameInputElement = screen.getByPlaceholderText(/pseudo/i);
        userEvent.type(usernameInputElement, "Toto1234");
        expect(usernameInputElement.value).toBe('Toto1234');
    });
    
    test("should be able to type an email", () => {
        const emailInputElement = screen.getByPlaceholderText(/email/i);
        userEvent.type(emailInputElement, "toto1234@test.com");
        expect(emailInputElement.value).toBe('toto1234@test.com');
    });
    
    test("should be able to type a password", () => {
        const passwordInputElement = screen.getByPlaceholderText('Mot de passe..');
        userEvent.type(passwordInputElement, "123456");
        expect(passwordInputElement.value).toBe('123456');
    });
    
    test("should be able to type a confirmation password", () => {
        const confirmPasswordInputElement = screen.getByPlaceholderText(/confirmation/i);
        userEvent.type(confirmPasswordInputElement, "123456");
        expect(confirmPasswordInputElement.value).toBe('123456');
    });
});

/* const mocks = [
    {
        request: {
            query: REGISTER_USER,
            variables: {
                register: {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                }
            },
        },
        result: {
            errors: {
                username: [new GraphQLError("Le nom d'utilisateur ne doit pas être vide")],
            }
        }
    },
]; */

/* const dogMocks = [
    {
        request: {
            query: GET_DOG_QUERY,
            variables: { name: 'Buck' },
        },
        result: {
            data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
        },
    },
    {
        request: {
            query: DELETE_DOG_MUTATION,
            variables: { name: 'Buck', breed: 'poodle' },
        },
        result: {
            errors: [new GraphQLError('GraphQL error !')],
        }
    }
]; */

describe('Test errors during form submission', function(){
    

    /* const mocks = [
        {
            request: {
                query: REGISTER_USER,
                variables: {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                },
            },
            result: {
                errors: [new GraphQLError("Le nom d'utilisateur ne doit pas être vide")]
            }
        },
    ]; */
    const mocks = [
        {
            request: {
                query: REGISTER_USER,
                variables: {
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                },
            },
            result: {
                errors: [new UserInputError('Errors', { errors: { username: "Le nom d'utilisateur ne doit pas être vide" } })]
            },
        },
    ];
    /* result: () => {
        // ...arbitrary logic...

        return {
            data: {
                dog: { id: '1', name: 'Buck', breed: 'bulldog' },
            },
        }
    }, */

    const userDummy = {
        username: 'Jean'
    };

    beforeEach(() => {
        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
    });

    //TODO: utilise une requete graphQL, agir en conséquence
    test("should show username error on invalid username", async () => {
        const usernameErrorElement1 = screen.queryByText("Le nom d'utilisateur ne doit pas être vide");
        const submitBtnElement = screen.getByRole('button');

        screen.debug();
        expect(usernameErrorElement1).not.toBeInTheDocument();

        userEvent.click(submitBtnElement);
        //userEvent.dblClick(submitBtnElement);

        //const usernameErrorElement2 = screen.queryByText("Le nom d'utilisateur ne doit pas être vide");
        const usernameErrorElement2 = await screen.findAllByText("Le nom d'utilisateur ne doit pas être vide");
        screen.debug();

        expect(usernameErrorElement2.length).toBe(2);
    });
});

//Variant for result
/* result: () => {
    // ...arbitrary logic...

    return {
        data: {
            dog: { id: '1', name: 'Buck', breed: 'bulldog' },
        },
    }
}, */

/* const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
if(!valid){
    throw new UserInputError('Errors', { errors });
} */

