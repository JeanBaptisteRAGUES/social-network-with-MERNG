import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import './App.css';
//import 'semantic-ui-css/semantic.min.css'

import { AuthProvider } from './context/auth';
//import AuthRoute from './utils/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import Conversations from './pages/Conversations';
import SingleConversation from './pages/SingleConversation';
import Profile from './pages/Profile';

//TODO: error boundary class component ?
function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar/>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route exact path="/login" element={<Login/>} />
            <Route exact path="/register" element={<Register/>} />
            <Route exact path="/posts/:postId" element={<SinglePost/>} />
            <Route exact path="/conversations" element={<Conversations/>} />
            <Route exact path="/single-conversation/:conversationId" element={<SingleConversation/>} />
            <Route exact path="/profile/:username" element={<Profile/>} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
}

/*

*/

export default App;
