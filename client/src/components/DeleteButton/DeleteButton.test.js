import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import DeleteButton, { DELETE_POST_MUTATION, DELETE_COMMENT_MUTATION }  from './index';

const mocks = [];

const idDummy = '123456';

test('DeleteButton renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <DeleteButton postId={idDummy} />
        </MockedProvider>,
    );

    const deletebuttonElem = screen.getByTestId('deletebutton');
    expect(deletebuttonElem).toBeInTheDocument();
});