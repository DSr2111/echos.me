// client/src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Navbar.css';

function AppNavbar({ isLoggedIn, handleLogout }) {
  return (
    <Navbar bg="light" variant="light" expand="lg" className="app-navbar">
  <Container fluid>
    <Navbar.Brand as={Link} to="/">
      echos.me
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto align-items-center">
        {!isLoggedIn ? (
          <>
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/signup">Sign Up</Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link as={Link} to="/dashboard">News</Nav.Link>
            <Nav.Link as={Link} to="/favorites">Favorites</Nav.Link>
            <Nav.Link as={Link} to="/chambers">Chambers</Nav.Link>
            <Nav.Link as={Link} to="/get-started">Get Started</Nav.Link>
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>
  );
}

export default AppNavbar;
