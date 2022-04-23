import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_DOG_QUERY, Dog } from './dog';

import { AuthContext } from './TestContext';
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

/*
test('renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <Dog name="Buck" />
        </MockedProvider>,
    );

    const loadingElem = screen.getByText(/loading.../i);
    expect(loadingElem).toBeInTheDocument();
});
*/

const userDummy = {
    username: 'Jean'
}

test('renders owner div without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={userDummy} >
                <Dog name="Buck" />
            </AuthProvider>
        </MockedProvider>,
    );

    const ownerDivElem = screen.getByText(/owner/i);
    expect(ownerDivElem).toBeInTheDocument();
});

test('renders owner name without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={userDummy} >
                <Dog name="Buck" />
            </AuthProvider>
        </MockedProvider>,
    );

    const ownerNameElem = screen.getByText(/Jean/i);
    expect(ownerNameElem).toBeInTheDocument();
});