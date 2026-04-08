
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>NourishNet</Link>
                    </Typography>
                    {auth?.user?.role === 'donor' && (
                        <Button color="inherit" component={Link} to="/donate">Post a Donation</Button>
                    )}
                    <Button color="inherit" component={Link} to="/profile">Profile</Button>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 4 }}>
                {children}
            </Container>
        </Box>
    );
};

export default Layout;
