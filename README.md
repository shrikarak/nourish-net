
# NourishNet

**NourishNet** is a web application designed to connect event managers with leftover food to nearby orphanages and shelters. It aims to reduce food waste and provide nutritious meals to children in need by facilitating timely and efficient donations. This platform also includes simulated integrations for ordering supplies and arranging deliveries.

## Features

- **Dual User Roles**: Separate registration and dashboards for **Donors** (event managers) and **Recipients** (orphanages).
- **Location-Based Matching**: Automatically identifies nearby recipients for new food donations using geocoding.
- **Dashboard & Notifications**: A dashboard-based notification system alerts users to relevant information.
  - **Recipients** see nearby available food donations.
  - **Donors** see their own posted donations and can find nearby orphanages to deliver to.
- **Quick Commerce Simulation**: Donors can order necessary supplies like food containers and markers from a simulated "QuickCart" service.
- **Courier Service Simulation**: Donors can book a simulated delivery for their food donation to a specific orphanage using a "RideSwift" service.
- **Profile Management**: Users can manage their profile information.
- **Post Donations**: Donors can easily post details about available leftover food.
- **Clean & Modern UI**: Built with React and Material-UI for a responsive and user-friendly experience.

## Technology Stack

- **Frontend**: React (TypeScript), Material-UI, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Geocoding**: `node-geocoder` with OpenStreetMap provider

## Setup and Installation

### Prerequisites

- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/shrikarak/nourish-net.git
cd nourish-net
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```
The backend server will start on `http://localhost:3001`.

### 3. Frontend Setup

In a new terminal window:
```bash
cd client
npm install
npm start
```
The frontend development server will start on `http://localhost:3000`.

## Usage

1.  Open your browser and navigate to `http://localhost:3000`.
2.  Register a new account as either a "Donor" or a "Recipient".
3.  Log in with your new credentials.
4.  **If you are a Donor**: 
    - Your dashboard shows your posted donations.
    - For "available" donations, you'll see a list of nearby orphanages. Click **Request Delivery** to book a simulated courier.
    - Use the **Post a Donation** button to create a new food availability alert.
    - Use the **Order Supplies** button to order simulated containers and markers.
5.  **If you are a Recipient**: Your dashboard shows a list of nearby available food donations, sorted by distance.

**Default Seeded Users for Testing:**
-   **Donor**: Username: `event_manager`, Password: `password`
-   **Recipient**: Username: `sunny_orphanage`, Password: `password`

## Deployment Guide

For production, you can build the React app and have the Express server serve the static files.

### 1. Build the React App

```bash
cd client
npm run build
```

### 2. Modify the Backend

Update your `server/src/index.js` to serve the static files from the `client/build` directory:

```javascript
const path = require('path');
// Add after app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// Add at the end of the file, to serve the app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});
```

### 3. Run the Production Server

From the `server` directory:

```bash
npm start
```
The application will now be served from `http://localhost:3001`.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
Copyright (c) 2026 Shrikara Kaudambady.

## Keywords
food donation, leftover food, event management, orphanage, food for children, charity, social impact, web application, react, nodejs, express, sqlite, geolocation, quick commerce, delivery, courier service, nutritious food
