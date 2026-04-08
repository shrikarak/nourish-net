
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { Typography, Paper, List, ListItem, ListItemText, CircularProgress, Button, Box, Divider } from '@mui/material';

const DashboardPage = () => {
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    // For recipients
    const [nearbyDonations, setNearbyDonations] = useState<any[]>([]);
    // For donors
    const [myDonations, setMyDonations] = useState<any[]>([]);
    const [nearbyOrphanages, setNearbyOrphanages] = useState<Record<number, any[]>>({});

    useEffect(() => {
        if (auth?.user) {
            if (auth.user.role === 'recipient') {
                axios.get(`http://localhost:3001/api/donations/nearby?lat=${auth.user.latitude}&lon=${auth.user.longitude}`)
                    .then(response => {
                        setNearbyDonations(response.data);
                        setLoading(false);
                    });
            } else if (auth.user.role === 'donor') {
                axios.get(`http://localhost:3001/api/donations/mine/${auth.user.id}`)
                    .then(response => {
                        setMyDonations(response.data);
                        // For each available donation, fetch nearby orphanages
                        response.data.forEach((donation: any) => {
                            if (donation.status === 'available') {
                                axios.get(`http://localhost:3001/api/orphanages/nearby?lat=${donation.latitude}&lon=${donation.longitude}`)
                                    .then(orphanageResponse => {
                                        setNearbyOrphanages(prev => ({ ...prev, [donation.id]: orphanageResponse.data }));
                                    });
                            }
                        });
                        setLoading(false);
                    });
            }
        }
    }, [auth?.user]);

    const renderRecipientDashboard = () => (
        <>
            <Typography variant="h5" gutterBottom>Nearby Food Donations</Typography>
            <List>
                {nearbyDonations.map(donation => (
                    <Paper key={donation.id} sx={{ mb: 2, p: 2 }}>
                        <ListItem>
                            <ListItemText
                                primary={`${donation.event_name} - ${donation.food_type} (serves ${donation.quantity})`}
                                secondary={`Pickup at: ${donation.address} | Available from: ${new Date(donation.pickup_time).toLocaleString()}`}
                            />
                            <Typography variant="body2">{donation.distance.toFixed(2)} km away</Typography>
                        </ListItem>
                    </Paper>
                ))}
                 {nearbyDonations.length === 0 && <Typography>No available donations nearby at the moment.</Typography>}
            </List>
        </>
    );

    const renderDonorDashboard = () => (
        <>
            <Typography variant="h5" gutterBottom>My Posted Donations</Typography>
            <List>
                {myDonations.map(donation => (
                    <Paper key={donation.id} sx={{ mb: 3, p: 2 }}>
                        <ListItem>
                            <ListItemText
                                primary={`${donation.event_name} - ${donation.food_type}`}
                                secondary={`Status: ${donation.status}`}
                            />
                        </ListItem>
                        {donation.status === 'available' && (
                            <Box sx={{ pl: 2, pr: 2, pb: 1 }}>
                                <Divider sx={{ my: 1 }}/>
                                <Typography variant="subtitle1" sx={{mb: 1}}>Nearby Orphanages to Deliver To:</Typography>
                                <List dense>
                                    {nearbyOrphanages[donation.id]?.map((orphanage: any) => (
                                        <ListItem key={orphanage.id} secondaryAction={
                                            <Button component={Link} to={`/book-delivery/${donation.id}/${orphanage.id}`} variant="outlined" size="small">
                                                Request Delivery
                                            </Button>
                                        }>
                                            <ListItemText primary={orphanage.name} secondary={`${orphanage.distance.toFixed(2)} km away`} />
                                        </ListItem>
                                    ))}
                                    {(!nearbyOrphanages[donation.id] || nearbyOrphanages[donation.id]?.length === 0) && <Typography variant="body2">No orphanages found nearby.</Typography>}
                                </List>
                            </Box>
                        )}
                    </Paper>
                ))}
                {myDonations.length === 0 && <Typography>You have not posted any donations yet.</Typography>}
            </List>
        </>
    );

    return (
        <Layout>
            <Typography variant="h4" gutterBottom>Welcome, {auth?.user?.name}</Typography>
            {loading ? <CircularProgress /> : (
                auth?.user?.role === 'recipient' ? renderRecipientDashboard() : renderDonorDashboard()
            )}
        </Layout>
    );
};

export default DashboardPage;
