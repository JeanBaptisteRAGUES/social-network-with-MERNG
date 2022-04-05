import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/fr';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';

const MessageCard = ({ message: { id, from, to, createdAt, content }, fromUser }) => {
    moment.locale('fr');
    const { user } = useContext(AuthContext);

    return (
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
            </Card.Content>
        </Card>
    )
}

export default MessageCard;