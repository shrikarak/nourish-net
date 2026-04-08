
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const PostDonationPage = () => {
    const auth = useAuth();
    const [formData, setFormData] = useState({
        event_name: '',
        food_type: '',
        quantity: '',
        pickup_time: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:3001/api/donations', { ...formData, user_id: auth?.user?.id });
            navigate('/');
        } catch (err) {
            setError('Failed to post donation. Please try again.');
        }
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography component="h1" variant="h5" gutterBottom>Post a New Food Donation</Typography>
                    <TextField margin="normal" required fullWidth label="Event Name" name="event_name" value={formData.event_name} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Type of Food" name="food_type" value={formData.food_type} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Estimated Quantity (e.g., 'serves 20-30')" name="quantity" value={formData.quantity} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Pickup Time" name="pickup_time" type="datetime-local" value={formData.pickup_time} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <TextField margin="normal" required fullWidth label="Pickup Address" name="address" value={formData.address} onChange={handleChange} />
                    
                    {error && <Typography color="error">{error}</Typography>}
                    <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>Post Donation</Button>
                </Box>
            </Container>
        </Layout>
    );
};

export default PostDonationPage;
