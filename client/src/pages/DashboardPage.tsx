
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { Typography, Paper, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const DashboardPage = () => {
    const auth = useAuth();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth?.user) {
            const endpoint = auth.user.role === 'recipient'
                ? `/api/donations/nearby?lat=${auth.user.latitude}&lon=${auth.user.longitude}`
                : `/api/orphanages/nearby?lat=${auth.user.latitude}&lon=${auth.user.longitude}`;

            axios.get(`http://localhost:3001${endpoint}`)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [auth?.user]);

    const renderRecipientDashboard = () => (
        <>
            <Typography variant="h5" gutterBottom>Nearby Food Donations</Typography>
            <List>
                {data.map(donation => (
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
            </List>
        </>
    );
    
    const renderDonorDashboard = () => (
        <>
            <Typography variant="h5" gutterBottom>Nearby Orphanages</Typography>
            <List>
                {data.map(orphanage => (
                    <Paper key={orphanage.id} sx={{ mb: 2, p: 2 }}>
                        <ListItem>
                            <ListItemText
                                primary={`${orphanage.name} (Capacity: ${orphanage.capacity})`}
                                secondary={`Contact: ${orphanage.contact_person} at ${orphanage.phone} | Address: ${orphanage.address}`}
                            />
                             <Typography variant="body2">{orphanage.distance.toFixed(2)} km away</Typography>
                        </ListItem>
                    </Paper>
                ))}
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
