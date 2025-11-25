import React, { useState } from 'react'
import styled from 'styled-components'
import Logo from './Logo';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';

export const Navbar = () => {
    const { authenticated, user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Don't show navbar on login page
    if (location.pathname === '/login') {
        return null;
    }

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate('/');
        }
    };

    return (
        <NavbarMain>
            <LogoContainer onClick={() => navigate('/')}>
                <Logo />
            </LogoContainer>
            
            <NavButton as={NavLink} to="/" active={location.pathname === '/'}>
                <span className="text">Home</span>
                <span className="icon"><HomeIcon /></span>
            </NavButton>

            <NavButton as={NavLink} to="/canvas" active={location.pathname === '/canvas'}>
                <span className="text">Live Canvas</span>
                <span className="icon"><AddIcon /></span>
            </NavButton>

            <NavButton as={NavLink} to="/collage" active={location.pathname === '/collage'}>
                <span className="text">Collage</span>
                <span className="icon"><AddIcon /></span>
            </NavButton>

            <NavButton as={NavLink} to="/boards" active={location.pathname === '/boards'}>
                <span className="text">Boards</span>
                <span className="icon"><AddIcon /></span>
            </NavButton>

            <NavButton as={NavLink} to="/pinBuilder" active={location.pathname === '/pinBuilder'}>
                <span className="text">Create</span>
                <span className="icon"><AddIcon /></span>
            </NavButton>

            <SearchWrapper>
                <SearchBarWrapper>
                    <IconButton>
                        <SearchIcon />
                    </IconButton>
                    <form onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Search" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type='submit'>submit</button>
                    </form>

                </SearchBarWrapper>
            </SearchWrapper>

            {authenticated && user ? (
                <IconWrapper>
                    <UserInfo onClick={() => navigate('/profile')}>
                        <Avatar 
                            src={user.avatar} 
                            alt={user.firstName}
                            sx={{ width: 24, height: 24, fontSize: 14, bgcolor: '#efefef', color: '#333', fontWeight: 'bold' }}
                        >
                            {user.firstName?.charAt(0)}
                        </Avatar>
                    </UserInfo>
                    <IconButton onClick={() => setShowDropdown(!showDropdown)}>
                        <ArrowDown />
                    </IconButton>
                    {showDropdown && (
                        <Dropdown>
                            <DropdownItem onClick={handleLogout}>
                                <LogoutIcon style={{ marginRight: '8px', fontSize: '18px' }} />
                                Logout
                            </DropdownItem>
                        </Dropdown>
                    )}
                </IconWrapper>
            ) : (
                <IconWrapper>
                    <LoginButton onClick={() => navigate('/login')}>
                        Login
                    </LoginButton>
                </IconWrapper>
            )}
        </NavbarMain>
    )
}

const NavbarMain = styled.div`
    display : flex;
    align-items: center;
    height: 80px;
    background-color: white;
    padding: 12px 16px;
    position: sticky;
    top: 0;
    z-index: 1000;
`

const LogoContainer = styled.div`
    margin-right: 10px;
`

const NavButton = styled.div`
    display: flex;
    height: 48px;
    min-width: 48px;
    padding: 0 16px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 24px;
    background-color: ${props => props.active ? 'rgb(12 12 12)' : 'white'};
    color: ${props => props.active ? 'white' : 'black'};
    margin-right: 10px;
    font-weight: 700;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    &:hover {
        background-color: ${props => props.active ? 'rgb(12 12 12)' : '#e9e9e9'};
    }

    .icon {
        display: none;
        align-items: center;
    }

    @media (max-width: 768px) {
        padding: 0;
        width: 48px;
        background-color: transparent;
        color: ${props => props.active ? 'black' : '#767676'};
        
        &:hover {
            background-color: #f0f0f0;
        }

        .text {
            display: none;
        }
        .icon {
            display: flex;
        }
    }
`

const SearchWrapper = styled.div`
    flex: 1;
    padding: 0 10px;
`
const SearchBarWrapper = styled.div`

    display:flex;
    height: 48px;
    border-radius: 50px;
    background-color: #e9e9e9;
    width: 100%;
    /* align-items: center; */
    border: none;
    padding-left: 10px;

    form{
        display: flex;
        flex:1;
        align-items: center;
    }

    form>input{
        background-color: transparent;
        border:none;
        width:100%;
        font-size: 16px;
        margin-left: 5px;
    }

    form>button{
        display:none;
    }

    input:focus{
        outline: none;
    }

    .MuiSvgIcon-root {
        font-size: 20px;
        font-weight: 900;
        color: #767676;
    }
`

const IconWrapper = styled.div`
    padding-left: 10px;
    position: relative;
    display: flex;
    align-items: center;
    gap: 4px;
`

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #f0f0f0;
    }
`

const Dropdown = styled.div`
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    z-index: 1000;
    padding: 8px;
`

const DropdownItem = styled.div`
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    color: #111;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    &:hover {
        background-color: #e9e9e9;
    }
`

const LoginButton = styled.button`
    background-color: #e60023;
    color: white;
    border: none;
    border-radius: 24px;
    padding: 10px 18px;
    font-weight: 700;
    font-size: 16px;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

    &:hover {
        background-color: #ad081b;
    }
`