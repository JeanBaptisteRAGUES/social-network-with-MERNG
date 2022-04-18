import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment/locale/fr';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth';

const ConversationCard = ({ conversation: { id, user1, user2, lastMessageDate, messages } }) => {
    moment.locale('fr');
    const { user } = useContext(AuthContext);
    const recipient = [user1, user2].find(u => u !== user.username);

    const unreadColor = 'rgb(190,220,255)';
    const readColor = 'rgb(220,220,220)';

    const unreadMessages = messages.some(m => m.to === user.username && !m.seen);

    return (
        <Card fluid as={Link} to={`/single-conversation/${id}`} state={{recipient: recipient}} style={ unreadMessages ? { backgroundColor: unreadColor } : { backgroundColor: readColor }} >
            <Card.Content>
                <Image
                    floated='left'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header>{recipient}</Card.Header>
                <Card.Meta>{moment(lastMessageDate).fromNow(true)}</Card.Meta>
                <Card.Description >
                    { messages.length > 0 ? messages[0].content : "Commencez une discussion" }
                </Card.Description>
            </Card.Content>
        </Card>
    )
}

export default ConversationCard;