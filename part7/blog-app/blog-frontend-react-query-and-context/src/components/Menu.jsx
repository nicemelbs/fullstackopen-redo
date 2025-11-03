import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import blogService from '../services/blogs'
import { Navbar, Nav, Button } from 'react-bootstrap'

const Menu = () => {
  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    blogService.setToken(null)
    queryClient.setQueryData(['user'], null)
  }

  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user'])

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link to="/">home</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link to="/users">users</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {user.name} logged in.
            <Button
              className="btn-sm"
              variant="outline-secondary"
              onClick={handleLogout}
            >
              logout
            </Button>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Menu
