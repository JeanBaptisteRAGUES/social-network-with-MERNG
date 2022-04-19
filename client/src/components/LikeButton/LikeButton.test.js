import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import LikeButton, { LIKE_POST_MUTATION }  from './index';

const mocks = [];

const userDummy = {
    username: 'test-user'
}

const postDummy = {
    id:"123456",
    body:"Ceci est un post fictif",
    createdAt: new Date().toISOString(),
    username: "test-user",
    likeCount: 2,
    commentCount: 1,
    likes: [
        {id: '1111', username: 'test-user01', createdAt: new Date().toISOString()},
        {id: '2222', username: 'test-user02', createdAt: new Date().toISOString()}
    ]
}

test('LikeButton renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <LikeButton user={userDummy} post={postDummy} />
        </MockedProvider>,
    );

    const likebuttonElem = screen.getByTestId('likebutton');
    expect(likebuttonElem).toBeInTheDocument();
});