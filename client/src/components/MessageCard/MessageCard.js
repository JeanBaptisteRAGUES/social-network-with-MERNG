import React, { Fragment, useContext } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/fr';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth';
import './message-card.css';

const MessageCard = ({ message: { id, from, to, createdAt, content, seen }, fromUser }) => {
    moment.locale('fr');
    const { user } = useContext(AuthContext);

    const userMessage = fromUser && (
        <div data-testid='direct-message-from-user' className='flexColRight' >
            <div className='messageContentUser' >
                {content}
            </div>
            <div className='graySmallText' >
                {`${moment(createdAt).fromNow(true)} - ${seen ? 'Vu' : 'Envoyé'}`}
            </div>
        </div>
    );

    const recipientMessage = !fromUser && (
        <div data-testid='direct-message-from-recipient' className='flexRowCenter' >
            <Image
                floated='left'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                rounded
            />
            <div className='flexColLeft' >
                <div className='messageContentRecipient' >
                    {content}
                </div>
                <div className='graySmallText' >
                    {moment(createdAt).fromNow(true)}
                </div>
            </div>
        </div>
    );

    return (
        <Fragment>
            {userMessage}
            {recipientMessage}
        </Fragment>
    )
}

export default MessageCard;