const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const DATA_FILE = path.join(__dirname, 'data.json');

const loadData = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        }
    } catch (error) {
        console.error("Error loading data:", error);
    }
    return null;
};

const saveData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Data Initialization
const savedData = loadData();
let users = savedData?.users || [
    { id: 1, name: "Pratishtha Deshpande", email: "pratishtha@example.com", password: "password123", role: "donor", bloodType: "B+", city: "Delhi", phone: "+91 98765 43210" },
    { id: 2, name: "St. Mary's Hospital", email: "admin@stmarys.org", password: "hospital123", role: "hospital", city: "Delhi", phone: "+91 88888 77777" }
];
let donors = savedData?.donors || [
    { id: 1, name: "Rohit Kumar", bloodType: "O-", location: { lat: 28.6139, lng: 77.2090 }, donations: 8, status: "Available", lastDonation: "2023-12-10", city: "Delhi" },
    { id: 2, name: "Priya Sharma", bloodType: "A+", location: { lat: 28.6239, lng: 77.2190 }, donations: 12, status: "In 2 hours", lastDonation: "2024-01-15", city: "Noida" },
    { id: 3, name: "Amit Patel", bloodType: "B+", location: { lat: 28.6339, lng: 77.2290 }, donations: 5, status: "Available", lastDonation: "2024-02-01", city: "Gurgaon" },
    { id: 4, name: "Sneha Gupta", bloodType: "AB-", location: { lat: 28.6439, lng: 77.2390 }, donations: 3, status: "Available", lastDonation: "2023-11-20", city: "Delhi" },
];

let requests = savedData?.requests || [
    { id: 1, hospital: "St. Mary's Hospital", bloodType: "O-", units: 4, collected: 2, urgency: "Critical", time: "12 min ago", distance: "2.3km", reason: "Accident victim" },
    { id: 2, hospital: "City General Hospital", bloodType: "A+", units: 2, collected: 1, urgency: "Active", time: "25 min ago", distance: "5.1km", reason: "Surgery" }
];

let inventory = savedData?.inventory || [
    { type: "O-", units: 2, total: 20, status: "Critical", percent: 10, color: "red", text: "text-red-600", bgColor: "bg-red-500" },
    { type: "A+", units: 8, total: 20, status: "Low", percent: 40, color: "yellow", text: "text-yellow-600", bgColor: "bg-yellow-500" },
    { type: "B+", units: 15, total: 20, status: "Stable", percent: 75, color: "green", text: "text-green-600", bgColor: "bg-green-500" },
    { type: "AB-", units: 3, total: 20, status: "Low", percent: 15, color: "red", text: "text-red-600", bgColor: "bg-red-500" }
];

let donorHistory = savedData?.donorHistory || [
    { id: 1, donorId: 1, hospital: "City Hospital", date: "2024-01-20", amount: "350ml", type: "Donation", status: "Completed" },
    { id: 2, donorId: 1, hospital: "Red Cross Center", date: "2023-11-15", amount: "350ml", type: "Donation", status: "Completed" }
];

let activities = savedData?.activities || [
    { id: 1, user: "City Hospital", action: "Broadcasted O- Request", time: "2m ago", type: "request" },
    { id: 2, user: "Rohit Kumar", action: "Donated at Red Cross", time: "15m ago", type: "donation" },
    { id: 3, user: "St. Mary's", action: "Inventory Updated", time: "1h ago", type: "system" }
];

const syncData = () => {
    saveData({ users, donors, requests, inventory, donorHistory, activities });
};

// Authentication Routes
app.post('/api/auth/signup', (req, res) => {
    const { name, email, password, role, bloodType, city, phone } = req.body;
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password, // Plain text for demonstration
        role,
        bloodType,
        city,
        phone
    };

    users.push(newUser);
    syncData();
    
    // Auto-create a donor entry if the role is donor
    if (role === 'donor') {
        donors.push({
            id: donors.length + 1,
            name,
            bloodType,
            location: { lat: 28.6139, lng: 77.2090 }, // Default Delhi
            donations: 0,
            status: "Available",
            lastDonation: "Never",
            city
        });
        syncData();
    }

    res.status(201).json({ 
        message: "User registered successfully", 
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } 
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        res.json({ 
            message: "Login successful", 
            user: { id: user.id, name: user.name, email: user.email, role: user.role } 
        });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('LifeLink API is running');
});

app.get('/api/stats', (req, res) => {
    const donorId = parseInt(req.query.donorId) || 1;
    const userDonorHistory = donorHistory.filter(h => h.donorId === donorId);
    const completedDonations = userDonorHistory.filter(h => h.status === "Completed").length;
    
    res.json({
        donorStats: {
            livesSaved: completedDonations * 3,
            avgResponse: "8.2",
            responseRate: "98%",
            cityRank: "#12",
            donations: completedDonations,
            nextEligible: "Nov 15"
        },
        hospitalStats: {
            activeRequests: requests.length,
            donorsResponded: donorHistory.length, // Total responses
            unitsCollected: donorHistory.filter(h => h.status === "Completed").length,
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
        collected: req.body.collected || 0,
        distance: "Calculating..."
    };
    requests.unshift(newRequest);
    syncData();
    res.status(201).json(newRequest);
});

app.post('/api/respond', (req, res) => {
    const { requestId, donorId } = req.body;
    const request = requests.find(r => r.id === requestId);
    if (request) {
        // We don't increment collected yet, only upon fulfillment
        const donor = donors.find(d => d.id === (donorId || 1));
        
        const newHistory = {
            id: donorHistory.length + 1,
            donorId: donorId || 1,
            requestId: requestId,
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

        syncData();
        res.json({ message: "Response recorded", history: newHistory });
    } else {
        res.status(404).json({ message: "Request not found" });
    }
});

app.post('/api/fulfill', (req, res) => {
    const { historyId } = req.body;
    const history = donorHistory.find(h => h.id === historyId);

    if (!history) {
        return res.status(404).json({ message: "History record not found" });
    }

    if (history.status === "Completed") {
        return res.status(400).json({ message: "Donation already fulfilled" });
    }

    const request = requests.find(r => r.id === history.requestId);
    const donor = donors.find(d => d.id === history.donorId);

    // 1. Mark as completed
    history.status = "Completed";

    // 2. Update request collected units
    if (request) {
        request.collected = (request.collected || 0) + 1;
        // Optional: if collected >= units, we could mark request as closed/completed
    }

    // 3. Update donor stats
    if (donor) {
        donor.donations += 1;
        donor.lastDonation = new Date().toISOString().split('T')[0];
    }

    // 4. Update hospital inventory (if request exists)
    let invItem = null;
    if (request) {
        invItem = inventory.find(i => i.type === request.bloodType);
        if (invItem) {
            invItem.units += 1;
            invItem.percent = (invItem.units / invItem.total) * 100;
            invItem.status = invItem.percent < 20 ? "Critical" : invItem.percent < 50 ? "Low" : "Stable";
        }
    }

    // 5. Add activity
    activities.unshift({
        id: activities.length + 1,
        user: request ? request.hospital : "Hospital",
        action: `Collected 1 unit from ${donor ? donor.name : "Donor"}`,
        time: "Just now",
        type: "system"
    });

    syncData();
    res.json({ message: "Donation fulfilled successfully", history, inventory: invItem });
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

        syncData();
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

app.get('/api/hospital/pending/:hospitalName', (req, res) => {
    const { hospitalName } = req.params;
    const pending = donorHistory.filter(h => h.hospital === hospitalName && h.status === "Scheduled");
    
    // Enrich with donor names
    const enrichedPending = pending.map(p => {
        const donor = donors.find(d => d.id === p.donorId);
        return { ...p, donorName: donor ? donor.name : "Unknown Donor" };
    });
    
    res.json(enrichedPending);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
