import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import ConversationCard from './index';

import { AuthProvider } from '../../context/auth';

const mocks = [];

const mockedConversation = {
    id: '123456',
    user1: 'test-user01',
    user2: 'test-user02',
    lastMessageDate: new Date().toISOString(),
    messages: [
        {id: '2222', from: 'test-user02', to: 'test-user01', content: 'Salut ! Oui ça va, et toi ?', createdAt: new Date().toISOString(), seen: false},
        {id: '1111', from: 'test-user01', to: 'test-user02', content: 'Salut ! Ça va ?', createdAt: new Date().toISOString(), seen: true}
    ]
}

const mockedUser = {
    username: 'Jean'
}

test('renders without error when user logged', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={{user: mockedUser}} >
                <Router>
                    <ConversationCard conversation={mockedConversation} />
                </Router>
            </AuthProvider>
        </MockedProvider>,
    );

    const conversationCardElem = screen.getByTestId('conversationcard');
    expect(conversationCardElem).toBeInTheDocument();
});