import React from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import PostCard from './index';

const mocks = [];

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

test('PostCard renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <Router>
                <PostCard post={postDummy} />
            </Router>
        </MockedProvider>,
    );

    const postcardElem = screen.getByTestId('postcard');
    expect(postcardElem).toBeInTheDocument();
});