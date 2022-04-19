import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { GET_DOG_QUERY, Dog } from './dog';

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

test('renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <Dog name="Buck" />
        </MockedProvider>,
    );

    const loadingElem = screen.getByText(/loading.../i);
    expect(loadingElem).toBeInTheDocument();
});