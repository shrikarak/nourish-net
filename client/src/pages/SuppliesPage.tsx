
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../App';
import { Container, Select, MenuItem, Button, Typography, Box, FormControl, InputLabel, List, ListItem, ListItemText, Paper } from '@mui/material';

const SuppliesPage = () => {
    const auth = useAuth();
    const [item, setItem] = useState("Food Containers (Pack of 50)");
    const [quantity, setQuantity] = useState(1);
    const [orders, setOrders] = useState([]);
    const [message, setMessage] = useState('');

    const fetchOrders = () => {
        if (auth?.user) {
            axios.get(`http://localhost:3001/api/supplies/orders/${auth.user.id}`)
                .then(response => setOrders(response.data));
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [auth?.user]);

    const handleOrder = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/supplies/order', {
                user_id: auth?.user?.id,
                item,
                quantity
            });
            setMessage(`Order placed successfully! Your order for ${quantity} x ${item} will arrive in ~20 minutes.`);
            fetchOrders();
        } catch (err) {
            setMessage('Failed to place order.');
        }
    };

    return (
        <Layout>
            <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>Order Supplies</Typography>
                <Paper sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h6">New Order</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Item</InputLabel>
                        <Select value={item} label="Item" onChange={(e) => setItem(e.target.value)}>
                            <MenuItem value={"Food Containers (Pack of 50)"}>Food Containers (Pack of 50)</MenuItem>
                            <MenuItem value={"Permanent Markers (Pack of 5)"}>Permanent Markers (Pack of 5)</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Quantity</InputLabel>
                        <Select value={quantity} label="Quantity" onChange={(e) => setQuantity(Number(e.target.value))}>
                            {[1, 2, 3, 4, 5].map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleOrder}>Place Order with QuickCart</Button>
                    {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
                </Paper>

                <Typography variant="h6">Order History</Typography>
                <List>
                    {orders.map((order: any) => (
                        <ListItem key={order.id} component={Paper} sx={{ mb: 1 }}>
                            <ListItemText
                                primary={`${order.quantity} x ${order.item}`}
                                secondary={`Ordered on: ${new Date(order.order_time).toLocaleString()} | Status: ${order.status}`}
                            />
                        </ListItem>
                    ))}
                </List>
            </Container>
        </Layout>
    );
};

export default SuppliesPage;
