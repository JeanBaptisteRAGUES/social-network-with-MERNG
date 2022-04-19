import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import ConversationCard  from './index';

const mocks = [];

const conversationDummy = {
    id: '123456',
    user1: 'test-user01',
    user2: 'test-user02',
    lastMessageDate: new Date().toISOString(),
    messages: [
        { id: '2222', from: 'test-user02', to: 'test-user01', content: 'Message privé factice n°2', createdAt: new Date().toISOString(),  seen: false},
        { id: '1111', from: 'test-user01', to: 'test-user02', content: 'Message privé factice n°1', createdAt: new Date().toISOString(),  seen: true}
    ]
}

test('ConversationForm renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <ConversationCard conversation={conversationDummy} />
        </MockedProvider>,
    );

    const conversationcardElem = screen.getByTestId('conversationcard');
    expect(conversationcardElem).toBeInTheDocument();
});