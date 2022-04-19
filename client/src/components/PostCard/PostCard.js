import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth';
import LikeButton from '../LikeButton';
import DeleteButton from '../DeleteButton';

const PostCard = ({post: {body, createdAt, id, username, likeCount, commentCount, likes}}) => {
    const { user } = useContext(AuthContext);

    return (
        <Card data-testid='postcard' fluid>
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                />
                <Card.Header as={Link} to={`/profile/${username}`} >{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`} >{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Popup content="Voir les commentaires" inverted trigger={
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`} >
                        <Button icon color='blue' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='blue' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>
                } 
                />
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}

export default PostCard;