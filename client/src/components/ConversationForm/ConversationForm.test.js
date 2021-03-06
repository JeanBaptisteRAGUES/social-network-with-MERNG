import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ConversationForm from './index';

import { AuthProvider } from '../../context/auth';

const mocks = [];

const mockedUser = {
    username: 'Jean'
}

test('renders without error when user logged', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={{user: mockedUser}} >
                <ConversationForm />
            </AuthProvider>
        </MockedProvider>,
    );

    const messageDivElem = screen.getByText(/message/i);
    expect(messageDivElem).toBeInTheDocument();
});