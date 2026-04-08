
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Link, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'donor',
        name: '',
        address: '',
        contact_person: '',
        phone: '',
        capacity: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3001/api/register', formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Sign up</Typography>
                <TextField margin="normal" required fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} />
                <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">I am a...</FormLabel>
                    <RadioGroup row name="role" value={formData.role} onChange={handleChange}>
                        <FormControlLabel value="donor" control={<Radio />} label="Donor (Event Manager)" />
                        <FormControlLabel value="recipient" control={<Radio />} label="Recipient (Orphanage)" />
                    </RadioGroup>
                </FormControl>

                <TextField margin="normal" required fullWidth label={formData.role === 'donor' ? "Organization Name" : "Orphanage Name"} name="name" value={formData.name} onChange={handleChange} />
                <TextField margin="normal" required fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
                <TextField margin="normal" fullWidth label="Contact Person" name="contact_person" value={formData.contact_person} onChange={handleChange} />
                <TextField margin="normal" fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

                {formData.role === 'recipient' && (
                    <TextField margin="normal" required fullWidth label="Capacity (Number of Children)" name="capacity" type="number" value={formData.capacity} onChange={handleChange} />
                )}

                {error && <Typography color="error">{error}</Typography>}
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleRegister}>Sign Up</Button>
                <Link component={RouterLink} to="/login" variant="body2">
                    {"Already have an account? Sign In"}
                </Link>
            </Box>
        </Container>
    );
};

export default RegisterPage;
