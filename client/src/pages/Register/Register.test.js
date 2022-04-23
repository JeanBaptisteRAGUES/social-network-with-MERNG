import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Register from './index';

import { AuthProvider } from '../../context/auth';

const mocks = [];

const userDummy = {
    username: 'Jean'
}

test('renders owner div without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={userDummy} >
                <Router>
                    <Register />
                </Router>
            </AuthProvider>
        </MockedProvider>,
    );

    const registerDivElem = screen.getByText(/inscription/i);
    expect(registerDivElem).toBeInTheDocument();
});

test('inputs should be initially empty', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={userDummy} >
                <Router>
                    <Register />
                </Router>
            </AuthProvider>
        </MockedProvider>,
    );
    const usernameInputElement = screen.getByPlaceholderText(/pseudo/i);
    const emailInputElement = screen.getByPlaceholderText(/email/i);
    const passwordInputElement = screen.getByPlaceholderText('Mot de passe..');
    const confirmPasswordInputElement = screen.getByPlaceholderText(/confirmation/i);
    expect(usernameInputElement.value).toBe('');
    expect(emailInputElement.value).toBe('');
    expect(passwordInputElement.value).toBe('');
    expect(confirmPasswordInputElement.value).toBe('');
});