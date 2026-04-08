
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

const ProfilePage = () => {
    const auth = useAuth();
    const [formData, setFormData] = useState<any>({});
    
    useEffect(() => {
        if (auth?.user) {
            setFormData(auth.user);
        }
    }, [auth?.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        // In a real app, you would have a /api/profile endpoint to update the user
        alert("Profile update functionality not implemented in this prototype.");
    };

    return (
        <Layout>
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography component="h1" variant="h5" gutterBottom>My Profile</Typography>
                    <TextField margin="normal" fullWidth label="Username" name="username" value={formData.username || ''} onChange={handleChange} InputProps={{ readOnly: true }} />
                    <TextField margin="normal" required fullWidth label={formData.role === 'donor' ? "Organization Name" : "Orphanage Name"} name="name" value={formData.name || ''} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Address" name="address" value={formData.address || ''} onChange={handleChange} />
                    
                    {formData.role === 'recipient' && (
                        <>
                            <TextField margin="normal" fullWidth label="Contact Person" name="contact_person" value={formData.contact_person || ''} onChange={handleChange} />
                            <TextField margin="normal" fullWidth label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
                            <TextField margin="normal" required fullWidth label="Capacity" name="capacity" type="number" value={formData.capacity || ''} onChange={handleChange} />
                        </>
                    )}

                    <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleUpdate}>Update Profile</Button>
                </Box>
            </Container>
        </Layout>
    );
};

export default ProfilePage;
