import React, { Fragment, useContext } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/fr';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import './components.css';

const MessageCard = ({ message: { id, from, to, createdAt, content, seen }, fromUser }) => {
    moment.locale('fr');
    const { user } = useContext(AuthContext);

    const userMessage = fromUser && (
        <div className='flexColRight' >
            <div className='messageContentUser' >
                {content}
            </div>
            <div className='graySmallText' >
                {`${moment(createdAt).fromNow(true)} - ${seen ? 'Vu' : 'Envoyé'}`}
            </div>
        </div>
    );

    const recipientMessage = !fromUser && (
        <div className='flexRowCenter' >
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

    /* return (
        <Card fluid as={Link} to={`/single-conversation/${id}`} style={ fromUser ? {backgroundColor: 'rgb(150,200,255)'} : {backgroundColor: 'rgb(240,240,240)'}} >
            <Card.Content>
                {
                    !fromUser ? (
                        <Image
                            floated='left'
                            size='mini'
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                        />
                    ) 
                    :
                    (null)
                }
                <Card.Meta>
                    {moment(createdAt).fromNow(true)}
                </Card.Meta>
                <Card.Description style={{ wordWrap: 'break-word' }} >
                    {content}
                </Card.Description>
                {
                    fromUser ? (
                        <Card.Header>
                            { seen ? 'Vu' : 'Envoyé' }
                        </Card.Header>
                    ) : (
                        null
                    )
                }
            </Card.Content>
        </Card>
    ) */
}

export default MessageCard;