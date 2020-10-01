import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from '../src/pages/Home'
import Login from '../src/pages/Login'
import { AuthProvider } from '../src/AuthContext'
import PrivateRoute from "./PrivateRoute"

function App() {  

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <PrivateRoute exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
