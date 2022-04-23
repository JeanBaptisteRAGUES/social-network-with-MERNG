import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_DOG_QUERY, Dog2 } from './dog2';

import { AuthProvider } from '../../context/auth';

const mocks = [
    {
        request: {
        query: GET_DOG_QUERY,
        variables: {
            name: 'Buck',
        },
        },
        result: {
        data: {
            dog: { id: '1', name: 'Buck', breed: 'bulldog' },
        },
        },
    },
];

const userDummy = {
    username: 'Jean'
}

test('renders owner div without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={userDummy} >
                <Dog2 name="Buck" />
            </AuthProvider>
        </MockedProvider>,
    );

    const ownerDivElem = screen.getByText(/salut/i);
    expect(ownerDivElem).toBeInTheDocument();
});