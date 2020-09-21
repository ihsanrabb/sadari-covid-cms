import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import NavBar from './components/Navbar'
import News from './components/News'

function App() {  

  return (
    <div className="App">
      <Container>
        <NavBar />
        <News />
      </Container>
    </div>
  );
}

export default App;
