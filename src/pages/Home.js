import React from "react";
import Container from '@material-ui/core/Container';
import NavBar from '../components/Navbar'
import News from '../components/News'

const Home = () => {
  return (
    <>
      <Container maxWidth={false}>
        <NavBar />
        <News />
      </Container>
    </>
  )
}

export default Home