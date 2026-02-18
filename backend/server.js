const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
let donors = [
    { id: 1, name: "Rohit Kumar", bloodType: "O-", location: { lat: 28.6139, lng: 77.2090 }, donations: 8, status: "Available", lastDonation: "2023-12-10", city: "Delhi" },
    { id: 2, name: "Priya Sharma", bloodType: "A+", location: { lat: 28.6239, lng: 77.2190 }, donations: 12, status: "In 2 hours", lastDonation: "2024-01-15", city: "Noida" },
    { id: 3, name: "Amit Patel", bloodType: "B+", location: { lat: 28.6339, lng: 77.2290 }, donations: 5, status: "Available", lastDonation: "2024-02-01", city: "Gurgaon" },
    { id: 4, name: "Sneha Gupta", bloodType: "AB-", location: { lat: 28.6439, lng: 77.2390 }, donations: 3, status: "Available", lastDonation: "2023-11-20", city: "Delhi" },
];

let requests = [
    { id: 1, hospital: "St. Mary's Hospital", bloodType: "O-", units: 4, collected: 2, urgency: "Critical", time: "12 min ago", distance: "2.3km", reason: "Accident victim" },
    { id: 2, hospital: "City General Hospital", bloodType: "A+", units: 2, collected: 1, urgency: "Active", time: "25 min ago", distance: "5.1km", reason: "Surgery" }
];

let inventory = [
    { type: "O-", units: 2, total: 20, status: "Critical", percent: 10, color: "red", text: "text-red-600", bgColor: "bg-red-500" },
    { type: "A+", units: 8, total: 20, status: "Low", percent: 40, color: "yellow", text: "text-yellow-600", bgColor: "bg-yellow-500" },
    { type: "B+", units: 15, total: 20, status: "Stable", percent: 75, color: "green", text: "text-green-600", bgColor: "bg-green-500" },
    { type: "AB-", units: 3, total: 20, status: "Low", percent: 15, color: "red", text: "text-red-600", bgColor: "bg-red-500" }
];

let donorHistory = [
    { id: 1, donorId: 1, hospital: "City Hospital", date: "2024-01-20", amount: "350ml", type: "Donation", status: "Completed" },
    { id: 2, donorId: 1, hospital: "Red Cross Center", date: "2023-11-15", amount: "350ml", type: "Donation", status: "Completed" }
];

// Routes
app.get('/', (req, res) => {
    res.send('LifeLink API is running');
});

app.get('/api/stats', (req, res) => {
    // Calculate stats based on current data
    res.json({
        donorStats: {
            livesSaved: donorHistory.filter(h => h.donorId === 1).length * 3,
            avgResponse: "8.2",
            responseRate: "98%",
            cityRank: "#12",
            donations: donorHistory.filter(h => h.donorId === 1).length,
            nextEligible: "Nov 15"
        },
        hospitalStats: {
            activeRequests: requests.length,
            donorsResponded: 18,
            unitsCollected: 142,
            successRate: "92%"
        }
    });
});

app.get('/api/donors', (req, res) => {
    res.json(donors);
});

app.get('/api/requests', (req, res) => {
    res.json(requests);
});

app.post('/api/requests', (req, res) => {
    const newRequest = {
        id: requests.length + 1,
        ...req.body,
        time: "Just now",
        collected: 0,
        distance: "Calculating..."
    };
    requests.unshift(newRequest);
    res.status(201).json(newRequest);
});

let activities = [
    { id: 1, user: "City Hospital", action: "Broadcasted O- Request", time: "2m ago", type: "request" },
    { id: 2, user: "Rohit Kumar", action: "Donated at Red Cross", time: "15m ago", type: "donation" },
    { id: 3, user: "St. Mary's", action: "Inventory Updated", time: "1h ago", type: "system" }
];

app.post('/api/respond', (req, res) => {
    const { requestId, donorId } = req.body;
    const request = requests.find(r => r.id === requestId);
    if (request) {
        request.collected = (request.collected || 0) + 1;
        const donor = donors.find(d => d.id === (donorId || 1));
        
        const newHistory = {
            id: donorHistory.length + 1,
            donorId: donorId || 1,
            hospital: request.hospital,
            date: new Date().toISOString().split('T')[0],
            amount: "350ml",
            type: "Donation",
            status: "Scheduled"
        };
        donorHistory.unshift(newHistory);
        
        activities.unshift({
            id: activities.length + 1,
            user: donor ? donor.name : "A Donor",
            action: `Responded to ${request.hospital}`,
            time: "Just now",
            type: "donation"
        });

        res.json({ message: "Response recorded", history: newHistory });
    } else {
        res.status(404).json({ message: "Request not found" });
    }
});

app.get('/api/activity', (req, res) => {
    res.json(activities);
});

app.post('/api/inventory/update', (req, res) => {
    const { type, units } = req.body;
    const item = inventory.find(i => i.type === type);
    if (item) {
        item.units = units;
        item.percent = (units / item.total) * 100;
        item.status = item.percent < 20 ? "Critical" : item.percent < 50 ? "Low" : "Stable";
        
        activities.unshift({
            id: activities.length + 1,
            user: "St. Mary's Hospital",
            action: `Updated ${type} inventory to ${units} units`,
            time: "Just now",
            type: "system"
        });

        res.json({ message: "Inventory updated", item });
    } else {
        res.status(404).json({ message: "Blood type not found" });
    }
});

app.get('/api/history/:donorId', (req, res) => {
    const history = donorHistory.filter(h => h.donorId === parseInt(req.params.donorId));
    res.json(history);
});

app.get('/api/inventory', (req, res) => {
    res.json(inventory);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
