import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import MenuBar from './index';

const mocks = [];

test('MenuBar (unlogged) renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <Router>
                <MenuBar />
            </Router>
        </MockedProvider>,
    );

    const menubarUnloggedElem = screen.getByTestId('menubar-unlogged');
    expect(menubarUnloggedElem).toBeInTheDocument();
});