import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import Register from './index';

import { AuthProvider } from '../../context/auth';

const mocks = [];

const userDummy = {
    username: 'Jean'
}

beforeEach(() => {
    render(
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

test("should show username error on invalid username", () => {
    const usernameErrorElement1 = screen.queryByText("Le nom d'utilisateur ne doit pas être vide");
    const submitBtnElement = screen.getByRole('button');
    const usernameInputElement = screen.getByPlaceholderText(/pseudo/i);

    expect(usernameErrorElement1).not.toBeInTheDocument();

    userEvent.click(submitBtnElement);

    //const usernameErrorElement2 = screen.queryByText("Le nom d'utilisateur ne doit pas être vide");
    const usernameErrorElement2 = screen.queryByText("Le nom d'utilisateur ne doit pas être vide");

    console.log(usernameInputElement.children);

    expect(usernameErrorElement2).toBeInTheDocument();
})