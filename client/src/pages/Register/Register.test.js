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

//TODO: voir si on peut faire ça directement avec les resolvers ou au moins avec des données en entrée qui sont cohérentes avec l'erreur
describe('Test errors during form submission', function(){

    const userDummy = {
        username: 'Jean'
    };

    test("should show username error on empty username", async () => {
        const errorDescription = "Le nom d'utilisateur ne doit pas être vide";

        const mocks = [
            {
                request: {
                    query: REGISTER_USER,
                    variables: {
                        username: '',
                        email: 'test@test.com',
                        password: '',
                        confirmPassword: '',
                    },
                },
                result: {
                    errors: [new UserInputError('Errors', { errors: { username: errorDescription } })]
                },
            },
        ];

        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );

        const usernameErrorElement1 = screen.queryByText(errorDescription);
        const submitBtnElement = screen.getByRole('button');
        const emailInputElement = screen.getByPlaceholderText(/email/i);
        userEvent.type(emailInputElement, "test@test.com");

        expect(usernameErrorElement1).not.toBeInTheDocument();

        userEvent.click(submitBtnElement);

        const usernameErrorElement2 = await screen.findAllByText(errorDescription);

        expect(usernameErrorElement2.length).toBe(2);
    });

    test("should show email error on empty email", async () => {
        const errorDescription = "L'email ne doit pas être vide";

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
                    errors: [new UserInputError('Errors', { errors: { email: errorDescription } })]
                },
            },
        ];

        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
        
        const emailErrorElement1 = screen.queryByText(errorDescription);
        const submitBtnElement = screen.getByRole('button');

        expect(emailErrorElement1).not.toBeInTheDocument();

        userEvent.click(submitBtnElement);

        const emailErrorElement2 = await screen.findAllByText(errorDescription);

        expect(emailErrorElement2.length).toBe(2);
    });

    test("should show email error on incorrect email", async () => {
        const errorDescription = "Veuillez entrer une adresse mail valide";

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
                    errors: [new UserInputError('Errors', { errors: { email: errorDescription } })]
                },
            },
        ];

        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
        
        const emailErrorElement1 = screen.queryByText(errorDescription);
        const submitBtnElement = screen.getByRole('button');

        expect(emailErrorElement1).not.toBeInTheDocument();

        userEvent.click(submitBtnElement);

        const emailErrorElement2 = await screen.findAllByText(errorDescription);

        expect(emailErrorElement2.length).toBe(2);
    });

    test("should show password error on empty password", async () => {
        const errorDescription = "Veuillez entrer un mot de passe";

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
                    errors: [new UserInputError('Errors', { errors: { password: errorDescription } })]
                },
            },
        ];

        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
        
        const passwordErrorElement1 = screen.queryByText(errorDescription);
        const submitBtnElement = screen.getByRole('button');

        expect(passwordErrorElement1).not.toBeInTheDocument();

        userEvent.click(submitBtnElement);

        const passwordErrorElement2 = await screen.findAllByText(errorDescription);

        expect(passwordErrorElement2.length).toBe(2);
    });

    test("should show confirm password error on passwords not matching", async () => {
        const errorDescription = "Les mots de passe doivent être identiques";

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
                    errors: [new UserInputError('Errors', { errors: { confirmPassword: errorDescription } })]
                },
            },
        ];

        const {container} = render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <AuthProvider value={userDummy} >
                    <Router>
                        <Register />
                    </Router>
                </AuthProvider>
            </MockedProvider>,
        );
        
        const confirmPasswordErrorElement1 = screen.queryByText(errorDescription);
        const submitBtnElement = screen.getByRole('button');

        expect(confirmPasswordErrorElement1).not.toBeInTheDocument();

        userEvent.click(submitBtnElement);

        const confirmPasswordErrorElement2 = await screen.findAllByText(errorDescription);

        expect(confirmPasswordErrorElement2.length).toBe(2);
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

