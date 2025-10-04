import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
  z-index: 1000;
  padding: 0 1rem;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;

  &:hover {
    color: #3b82f6;
  }

  &.active {
    color: #3b82f6;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  cursor: pointer;
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  color: #374151;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #374151;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 999;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 0.75rem 0;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #f3f4f6;

  &:hover {
    color: #3b82f6;
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <NavbarContainer>
      <NavContent>
        <Logo to="/">
          🏠 ArchGen
        </Logo>

        <NavLinks>
          <NavLink to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </NavLink>
          <NavLink to="/gallery" className={isActive('/gallery') ? 'active' : ''}>
            Gallery
          </NavLink>
          <NavLink to="/pricing" className={isActive('/pricing') ? 'active' : ''}>
            Pricing
          </NavLink>
        </NavLinks>

        <UserMenu>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-outline btn-sm">
                Dashboard
              </Link>
              <Link to="/editor" className="btn btn-primary btn-sm">
                Create Plan
              </Link>
              <UserAvatar onClick={toggleDropdown}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
                <Dropdown isOpen={isDropdownOpen}>
                  <DropdownItem to="/profile">Profile</DropdownItem>
                  <DropdownItem to="/dashboard">Dashboard</DropdownItem>
                  <DropdownButton onClick={handleLogout}>Logout</DropdownButton>
                </Dropdown>
              </UserAvatar>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
          <MobileMenuButton onClick={toggleMobileMenu}>
            ☰
          </MobileMenuButton>
        </UserMenu>
      </NavContent>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Home
        </MobileNavLink>
        <MobileNavLink to="/gallery" onClick={() => setIsMobileMenuOpen(false)}>
          Gallery
        </MobileNavLink>
        <MobileNavLink to="/pricing" onClick={() => setIsMobileMenuOpen(false)}>
          Pricing
        </MobileNavLink>
        {isAuthenticated ? (
          <>
            <MobileNavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/editor" onClick={() => setIsMobileMenuOpen(false)}>
              Create Plan
            </MobileNavLink>
            <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              Profile
            </MobileNavLink>
            <DropdownButton onClick={handleLogout}>
              Logout
            </DropdownButton>
          </>
        ) : (
          <>
            <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              Login
            </MobileNavLink>
            <MobileNavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              Get Started
            </MobileNavLink>
          </>
        )}
      </MobileMenu>
    </NavbarContainer>
  );
};

export default Navbar;
