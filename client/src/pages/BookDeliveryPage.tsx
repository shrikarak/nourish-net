
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { Container, Typography, Box, Paper, Button } from '@mui/material';

const BookDeliveryPage = () => {
    const { donationId, recipientId } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();

    // In a real app, you'd fetch donation and recipient details
    // For this prototype, we'll just show the IDs and a simulated fare.
    const pickupAddress = auth?.user?.address;
    const [dropoffAddress, setDropoffAddress] = useState('Loading...');
    const estimatedFare = (Math.random() * 15 + 5).toFixed(2); // Random fare between $5 and $20
    const [message, setMessage] = useState('');

    useEffect(() => {
        // You would typically fetch the recipient's address
        // For now, it's just for display and the backend handles the real data.
        setMessage('');
    }, [donationId, recipientId]);


    const handleBooking = async () => {
        try {
            await axios.post('http://localhost:3001/api/deliveries/request', {
                donation_id: donationId,
                recipient_id: recipientId,
                pickup_address: pickupAddress,
                dropoff_address: 'Recipient Address', // Backend has the real data
                estimated_fare: estimatedFare
            });
            setMessage('Delivery successfully booked with RideSwift! A driver is on their way.');
            setTimeout(() => navigate('/'), 3000);
        } catch (err) {
            setMessage('Failed to book delivery. Please try again.');
        }
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography component="h1" variant="h4" gutterBottom>Book a Delivery</Typography>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6">Pickup Location:</Typography>
                        <Typography gutterBottom>{pickupAddress}</Typography>
                        
                        <Typography variant="h6" sx={{ mt: 2 }}>Drop-off Location:</Typography>
                        <Typography gutterBottom>Recipient ID: {recipientId}</Typography>

                        <Typography variant="h6" sx={{ mt: 2 }}>Simulated Quote</Typography>
                        <Typography>Estimated Fare with RideSwift: ${estimatedFare}</Typography>

                        <Button fullWidth variant="contained" sx={{ mt: 4 }} onClick={handleBooking} disabled={!!message}>
                            {message ? 'Booking Confirmed!' : 'Confirm Pickup'}
                        </Button>
                        {message && <Typography sx={{ mt: 2 }} color="primary">{message}</Typography>}
                    </Paper>
                </Box>
            </Container>
        </Layout>
    );
};

export default BookDeliveryPage;
