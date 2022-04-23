import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TestPage from './index';

import { AuthProvider } from '../../context/auth';

const mocks = [];

const userDummy = {
    username: 'Jean'
}

test('renders owner div without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <AuthProvider value={userDummy} >
                <TestPage />
            </AuthProvider>
        </MockedProvider>,
    );

    const salutDivElem = screen.getByText(/salut/i);
    expect(salutDivElem).toBeInTheDocument();
});