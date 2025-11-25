import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import './App.css';
import {Navbar} from "./components/Navbar.js"
import Mainboard from "./components/Mainboard"
import Pinbuilder from './Pages/Pinbuilder';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import PinDetail from './Pages/PinDetail';
import LiveCanvas from './Pages/LiveCanvas';
import CollageBuilder from './Pages/CollageBuilder';
import Boards from './Pages/Boards';
import SharedBoard from './Pages/SharedBoard';
import {BrowserRouter as Router,  Routes, Route, Navigate} from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL || "http://localhost:3001/graphql";

  const client = new ApolloClient({
    uri: GRAPHQL_URL,
    cache: new InMemoryCache(),
    credentials: 'include',
  })

  return(
    <ApolloProvider client = {client}>
      <Router>
          <Navbar />
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='/' element={<Mainboard />}/>
          <Route path ="/pinBuilder" element={
            <ProtectedRoute>
              <Pinbuilder />
            </ProtectedRoute>
          }/>
          <Route path ="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }/>
          <Route path="/pin/:id" element={<PinDetail />} />
          <Route path="/canvas" element={<LiveCanvas />} />
          <Route path="/canvas/:roomId" element={<LiveCanvas />} />
          <Route path="/collage" element={<CollageBuilder />} />
          <Route path="/boards" element={
            <ProtectedRoute>
              <Boards />
            </ProtectedRoute>
          } />
          <Route path="/board/:id" element={
            <ProtectedRoute>
              <SharedBoard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </ApolloProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
