import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';

import ConversationForm, { CREATE_CONVERSATION }  from './index';

const mocks = [];

test('ConversationForm renders without error', () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
            <ConversationForm />
        </MockedProvider>,
    );

    const recipientInputElem = screen.getByText(/destinataire/i);
    expect(recipientInputElem).toBeInTheDocument();
});