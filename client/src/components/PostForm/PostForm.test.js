import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import PostForm, {CREATE_POST_MUTATION} from './index';

const mocks = [];


test('PostForm renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <PostForm />
        </MockedProvider>,
    );

    const submitBtnElem = screen.getByText(/valider/i);
    expect(submitBtnElem).toBeInTheDocument();
});
