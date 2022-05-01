import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';

import { GET_DOG_QUERY, DELETE_DOG_MUTATION, Dog } from './dog';
import { AuthContext } from './TestContext';
import { AuthProvider } from '../../context/auth';
import { act } from 'react-dom/test-utils';
import { GraphQLError } from 'graphql';

describe('Render tests', function(){
    const mockedUser = {
        username: 'Jean'
    };

    const dogMocks = [
        {
            request: {
                query: GET_DOG_QUERY,
                variables: { name: 'Buck' },
            },
            result: {
                data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
            },
        },
        {
            request: {
                query: DELETE_DOG_MUTATION,
                variables: { name: 'Buck' },
            },
            result: {
                data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
            },
        }
    ];
    
    beforeEach(() => {
        const {container} = render(
            <MockedProvider mocks={dogMocks} addTypename={false}>
                <AuthProvider value={mockedUser} >
                    <Dog name="Buck" />
                </AuthProvider>
            </MockedProvider>,
        );
    });

    //Testing the "loading" state
    test('renders without error', () => {
        const loadingDivElem = screen.getByText(/loading/i);
        expect(loadingDivElem).toBeInTheDocument();
    });

    //Testing the "success" state
    test('renders dog', async () => {
        //await new Promise(resolve => setTimeout(resolve, 0));
        //act(async () => await waitForElementToBeRemoved(() => screen.getByText(/loading/i)));

        const dogDivElem = await screen.findByText(/buck is a poodle/i);
        expect(dogDivElem).toBeInTheDocument();
    });

    //Testing render delete button
    test('renders delete button', async () => {
        const deleteBtnDivElem = await screen.findByRole('button');
        expect(deleteBtnDivElem).toBeInTheDocument();
    });
});

//Variant for result
/* result: () => {
    // ...arbitrary logic...

    return {
        data: {
            dog: { id: '1', name: 'Buck', breed: 'bulldog' },
        },
    }
}, */

describe('Errors tests', function(){
    const mockedUser = {
        username: 'Jean'
    };

    //Testing network errors
    test('shows network error UI', async () => {
        const dogMock = {
            request: {
                query: GET_DOG_QUERY,
                variables: { name: 'Buck' },
            },
            error: new Error('An error occured'),
        };

        render(
            <MockedProvider mocks={[dogMock]} addTypename={false}>
                <AuthProvider value={mockedUser} >
                    <Dog name="Buck" />
                </AuthProvider>
            </MockedProvider>,
        );

        const errorDivElem = await screen.findByText(/error/i);
        expect(errorDivElem).toBeInTheDocument();
    });

    //Testing graphQL errors
    test('shows graphQL error UI', async () => {
        const dogMock = {
            request: {
                query: GET_DOG_QUERY,
                variables: { name: 'Buck' },
            },
            result: {
                errors: [new GraphQLError('GraphQL error !')],
            }
        };

        render(
            <MockedProvider mocks={[dogMock]} addTypename={false}>
                <AuthProvider value={mockedUser} >
                    <Dog name="Buck" />
                </AuthProvider>
            </MockedProvider>,
        );

        const errorDivElem = await screen.findByText(/error/i);
        expect(errorDivElem).toBeInTheDocument();
    });
});

describe('User interactions tests', function(){
    const mockedUser = {
        username: 'Jean'
    };

    const dogMocks = [
        {
            request: {
                query: GET_DOG_QUERY,
                variables: { name: 'Buck' },
            },
            result: {
                data: { dog: { id: 1, name: 'Buck', breed: 'poodle' } },
            },
        },
        {
            request: {
                query: DELETE_DOG_MUTATION,
                variables: { name: 'Buck' },
            },
            result: {
                data: { deleteDog: { id: 1, name: 'Buck', breed: 'poodle' } },
            },
        }
    ];
    
    beforeEach(() => {
        const {container} = render(
            <MockedProvider mocks={dogMocks} addTypename={false}>
                <AuthProvider value={mockedUser} >
                    <Dog name="Buck" />
                </AuthProvider>
            </MockedProvider>,
        );
    });

    //Testing clicking delete button gives visual feedback
    test('clicking delete button gives visual feedback', async () => {
        const deleteBtnDivElem = await screen.findByRole('button');
        userEvent.click(deleteBtnDivElem);
        const deleteMessageDivElem = await screen.findByText(/deleted !/i);
        screen.debug();
        expect(deleteMessageDivElem).toBeInTheDocument();
    });
});
