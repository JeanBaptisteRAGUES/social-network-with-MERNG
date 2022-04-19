import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import MessageCard from './index';

const mocks = [];

const messageDummy = {
    id: '123456',
    from: 'test-user01',
    to: 'test-user02',
    createdAt: new Date().toISOString(),
    content: 'Ceci est un message factice',
    seen: false
}

test('MessageCard renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <MessageCard message={messageDummy} fromUser={true} />
        </MockedProvider>,
    );

    const messagecardElem = screen.getByTestId('direct-message-from-user');
    expect(messagecardElem).toBeInTheDocument();
});