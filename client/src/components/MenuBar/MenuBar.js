import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { AuthContext } from '../../context/auth';

const MenuBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substring(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const disconnect = () => {
    logout();
    navigate('/');
  }

  const menuBar = user ? (
    <Menu data-testid='menubar-logged' pointing secondary size='massive' color='teal'>
        <Menu.Item
            name={user.username}
            active
            as={Link}
            to="/"
        />
        <Menu.Menu position='right'>
            <Menu.Item
                name='messages'
                active={activeItem === 'messages'}
                onClick={handleItemClick}
                as={Link}
                to="/conversations"
            />
            <Menu.Item
                name='logout'
                onClick={disconnect}
            />
        </Menu.Menu>
    </Menu>
  ) : (
    <Menu data-testid='menubar-unlogged' pointing secondary size='massive' color='teal'>
        <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={handleItemClick}
            as={Link}
            to="/"
        />
        <Menu.Menu position='right'>
            <Menu.Item
                name='login'
                active={activeItem === 'login'}
                onClick={handleItemClick}
                as={Link}
                to="/login"
            />
            <Menu.Item
                name='register'
                active={activeItem === 'register'}
                onClick={handleItemClick}
                as={Link}
                to="/register"
            />
        </Menu.Menu>
    </Menu>
  )

  return menuBar;
}

export default MenuBar;
