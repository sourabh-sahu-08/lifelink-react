const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Groq } = require('groq-sdk');

// Connect DB
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Donor = require('./models/Donor');
const Request = require('./models/Request');
const Inventory = require('./models/Inventory');
const DonorHistory = require('./models/DonorHistory');
const Activity = require('./models/Activity');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const BloodRequest = require('./models/BloodRequest');
const BloodSupply = require('./models/BloodSupply');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Haversine Distance Calculation Utility
function getDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "?? km";
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1) + "km";
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

app.use(cors({
    origin: ['https://lifelink-react.vercel.app', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

app.use(express.json());

// Initialize connection and seed inventory if empty
connectDB().then(async () => {
    try {
        const invCount = await Inventory.countDocuments();
        if (invCount === 0) {
            await Inventory.insertMany([
                { type: "O-", units: 2, total: 20, status: "Critical", percent: 10, color: "red", text: "text-red-600", bgColor: "bg-red-500" },
                { type: "A+", units: 8, total: 20, status: "Low", percent: 40, color: "yellow", text: "text-yellow-600", bgColor: "bg-yellow-500" },
                { type: "B+", units: 15, total: 20, status: "Stable", percent: 75, color: "green", text: "text-green-600", bgColor: "bg-green-500" },
                { type: "AB-", units: 3, total: 20, status: "Low", percent: 15, color: "red", text: "text-red-600", bgColor: "bg-red-500" }
            ]);
            console.log('Database seeded with initial inventory');
        }
    } catch(err) {
        console.error('Error seeding data:', err);
    }
});

let groq;
try {
    if (process.env.GROQ_API_KEY) {
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        console.log("Groq Engine Initialized");
    } else {
        console.warn("GROQ_API_KEY is not set. Chatbot endpoint will return an error.");
    }
} catch (e) {
    console.warn("Failed to initialize Groq:", e);
}

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password, role, bloodType, city, phone } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({
            name, email, password, role, bloodType, city, phone
        });
        await newUser.save();
        
        if (role === 'donor') {
            const newDonor = new Donor({
                name,
                bloodType,
                location: { lat: 22.0797, lng: 82.1391 }, // Default Bilaspur
                donations: 0,
                status: "Available",
                lastDonation: "Never",
                city
            });
            await newDonor.save();
        }

        res.status(201).json({ 
            message: "User registered successfully", 
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, location: newUser.location, city: newUser.city, bloodType: newUser.bloodType, phone: newUser.phone } 
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Plain text for demonstration as per original logic
        const user = await User.findOne({ email, password });
        
        if (user) {
            res.json({ 
                message: "Login successful", 
                user: { 
                    id: user.id || user._id, 
                    name: user.name, 
                    email: user.email, 
                    role: user.role, 
                    bloodType: user.bloodType, 
                    city: user.city,
                    location: user.location,
                    phone: user.phone
                } 
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/auth/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodType: user.bloodType,
                city: user.city,
                location: user.location,
                phone: user.phone
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Routes
app.get('/', (req, res) => {
    res.send('LifeLink API is running on MongoDB');
});

app.get('/api/stats', async (req, res) => {
    try {
        const donorId = parseInt(req.query.donorId) || 1;
        const userDonorHistory = await DonorHistory.find({ donorId });
        const completedDonations = userDonorHistory.filter(h => h.status === "Completed").length;
        
        const allRequests = await Request.countDocuments();
        const allResponses = await DonorHistory.countDocuments();
        const allCompleted = await DonorHistory.countDocuments({ status: "Completed" });

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
                activeRequests: allRequests,
                donorsResponded: allResponses,
                unitsCollected: allCompleted,
                successRate: "92%"
            }
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/donors', async (req, res) => {
    try {
        const donors = await Donor.find({}).sort({createdAt: -1});
        res.json(donors);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/requests', async (req, res) => {
    try {
        const requests = await Request.find({}).sort({_id: -1});
        res.json(requests);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/requests', async (req, res) => {
    try {
        const distance = (Math.random() * 8 + 1).toFixed(1) + "km";
        const newRequest = new Request({
            ...req.body,
            time: "Just now",
            collected: req.body.collected || 0,
            distance: distance
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/respond', async (req, res) => {
    try {
        const { requestId, donorId } = req.body;
        const request = await Request.findOne({ id: parseInt(requestId) }) || await Request.findById(requestId).catch(() => null);
        
        if (request) {
            const donor = await Donor.findOne({ id: donorId }) || await Donor.findById(donorId).catch(() => null);
            
            const newHistory = new DonorHistory({
                donorId: donorId || 1,
                requestId: request.id || parseInt(requestId),
                hospital: request.hospital,
                date: new Date().toISOString().split('T')[0],
                amount: "350ml",
                type: "Donation",
                status: "Scheduled"
            });
            await newHistory.save();
            
            const newAct = new Activity({
                user: donor ? donor.name : "A Donor",
                action: `Responded to ${request.hospital}`,
                time: "Just now",
                type: "donation"
            });
            await newAct.save();

            res.json({ message: "Response recorded", history: newHistory });
        } else {
            res.status(404).json({ message: "Request not found" });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/fulfill', async (req, res) => {
    try {
        const { historyId } = req.body;
        
        const history = await DonorHistory.findOne({ id: historyId }) || await DonorHistory.findById(historyId).catch(()=>null);

        if (!history) {
            return res.status(404).json({ message: "History record not found" });
        }

        if (history.status === "Completed") {
            return res.status(400).json({ message: "Donation already fulfilled" });
        }

        const request = await Request.findOne({ id: history.requestId }) || await Request.findById(history.requestId).catch(()=>null);
        const donor = await Donor.findOne({ id: history.donorId }) || await Donor.findById(history.donorId).catch(()=>null);

        // 1. Mark as completed
        history.status = "Completed";
        await history.save();

        // 2. Update request
        if (request) {
            request.collected = (request.collected || 0) + 1;
            await request.save();
        }

        // 3. Update donor
        if (donor) {
            donor.donations += 1;
            donor.lastDonation = new Date().toISOString().split('T')[0];
            await donor.save();
        }

        // 4. Update hospital inventory
        let invItem = null;
        if (request) {
            invItem = await Inventory.findOne({ type: request.bloodType });
            if (invItem) {
                invItem.units += 1;
                invItem.percent = (invItem.units / invItem.total) * 100;
                invItem.status = invItem.percent < 20 ? "Critical" : invItem.percent < 50 ? "Low" : "Stable";
                await invItem.save();
            }
        }

        // 5. Add activity
        const newAct = new Activity({
            user: request ? request.hospital : "Hospital",
            action: `Collected 1 unit from ${donor ? donor.name : "Donor"}`,
            time: "Just now",
            type: "system"
        });
        await newAct.save();

        res.json({ message: "Donation fulfilled successfully", history, inventory: invItem });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/activity', async (req, res) => {
    try {
        const activities = await Activity.find({}).sort({_id: -1}).limit(50);
        res.json(activities);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/inventory/update', async (req, res) => {
    try {
        const { type, units } = req.body;
        const item = await Inventory.findOne({ type: type });
        if (item) {
            item.units = units;
            item.percent = (units / item.total) * 100;
            item.status = item.percent < 20 ? "Critical" : item.percent < 50 ? "Low" : "Stable";
            await item.save();
            
            const act = new Activity({
                user: "Hospital Admin",
                action: `Updated ${type} inventory to ${units} units`,
                time: "Just now",
                type: "system"
            });
            await act.save();

            res.json({ message: "Inventory updated", item });
        } else {
            res.status(404).json({ message: "Blood type not found" });
        }
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/history/:donorId', async (req, res) => {
    try {
        // match either numeric ID or Mongo ObjectId if passed
        const val = req.params.donorId;
        let query = {};
        if (!isNaN(val)) query.donorId = parseInt(val);
        else query.donorId = val;
        
        const history = await DonorHistory.find(query).sort({_id: -1});
        res.json(history);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/inventory', async (req, res) => {
    try {
        const inv = await Inventory.find({});
        res.json(inv);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.get('/api/hospital/pending/:hospitalName', async (req, res) => {
    try {
        const { hospitalName } = req.params;
        const pending = await DonorHistory.find({ hospital: hospitalName, status: "Scheduled" });
        
        const enrichedPending = await Promise.all(pending.map(async p => {
            const donor = await Donor.findOne({ id: p.donorId }) || await Donor.findById(p.donorId).catch(()=>null);
            return { ...p._doc, donorName: donor ? donor.name : "Unknown Donor" };
        }));
        
        res.json(enrichedPending);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        if (!groq) {
            return res.status(503).json({ error: "Groq AI is not configured. Please add GROQ_API_KEY to backend/.env." });
        }
        const { message, history } = req.body;
        
        let messages = [
            { role: "system", content: "You are the LifeLink AI Assistant. You help users with blood donation queries, finding hospitals, and using the website. You can also tell them about reward points for donations. Be very concise, friendly, and helpful. Keep responses to roughly 2-3 sentences max." }
        ];

        if (history && Array.isArray(history)) {
            // Keep maximum history to last 5 interactions to avoid token limits
            const recentHistory = history.slice(-5);
            messages = messages.concat(recentHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })));
        }

        messages.push({ role: "user", content: message });

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-8b-instant", // Use updated fast Llama-3.1 8B model on Groq
            temperature: 0.7,
            max_tokens: 200
        });

        res.json({ response: chatCompletion.choices[0]?.message?.content || "I couldn't process that. Please try again." });
    } catch (err) {
        console.error("Groq Chat Error:", err);
        res.status(500).json({ error: "Failed to generate AI response: " + err.message });
    }
});

// Chat & Conversation Routes
app.post('/api/conversations', async (req, res) => {
    try {
        const { sender, receiver } = req.body;
        if (!sender || !receiver) return res.status(400).json({ error: "Sender and receiver required" });
        
        let conv = await Conversation.findOne({ participants: { $all: [sender, receiver] } });
        if (!conv) {
            conv = await Conversation.create({ participants: [sender, receiver] });
        }
        res.json(conv);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/conversations/:user', async (req, res) => {
    try {
        const convs = await Conversation.find({ participants: req.params.user }).sort('-updatedAt');
        res.json(convs);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/messages/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.conversationId }).sort('createdAt');
        res.json(messages);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    try {
        const { conversationId, sender, text } = req.body;
        const msg = await Message.create({ conversationId, sender, text });
        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: text });
        res.json(msg);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});

// Blood Request Routes (Donors or Hospitals requesting blood)
app.post('/api/blood-requests', async (req, res) => {
    try {
        const { requesterName, requesterRole, bloodType, units, urgency, reason, city, location } = req.body;
        
        let finalLocation = location;
        if (!finalLocation) {
            const user = await User.findOne({ name: requesterName });
            if (user && user.location) {
                finalLocation = user.location;
            } else {
                finalLocation = { lat: 22.0797, lng: 82.1391 }; // Default Bilaspur
            }
        }

        const br = await BloodRequest.create({ 
            requesterName, requesterRole, bloodType, units, urgency, reason, city, 
            location: finalLocation 
        });
        res.json(br);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blood-requests', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        let requests = await BloodRequest.find({ status: 'Open' }).sort('-createdAt');
        
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            requests = requests.map(r => ({
                ...r.toObject(),
                distance: getDistance(userLat, userLng, r.location.lat, r.location.lng)
            }));
        } else {
            requests = requests.map(r => ({
                ...r.toObject(),
                distance: (Math.random() * 5 + 1).toFixed(1) + "km"
            }));
        }
        res.json(requests);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/blood-requests/:id/respond', async (req, res) => {
    try {
        const { responderName } = req.body;
        const br = await BloodRequest.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { respondedBy: responderName }, status: 'Fulfilled' },
            { new: true }
        );
        res.json(br);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

// Blood Supply Routes (Hospitals posting available blood)
app.post('/api/blood-supply', async (req, res) => {
    try {
        const { hospitalName, bloodType, units, expiryDate, notes, city, location } = req.body;
        
        let finalLocation = location;
        if (!finalLocation) {
            const user = await User.findOne({ name: hospitalName });
            if (user && user.location) {
                finalLocation = user.location;
            } else {
                finalLocation = { lat: 22.1158, lng: 82.1643 }; // Default Apollo Bilaspur
            }
        }

        const bs = await BloodSupply.create({ 
            hospitalName, bloodType, units, expiryDate, notes, city,
            location: finalLocation 
        });
        res.json(bs);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/blood-supply', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        let supply = await BloodSupply.find({ status: 'Available' }).sort('-createdAt');
        
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            supply = supply.map(s => ({
                ...s.toObject(),
                distance: getDistance(userLat, userLng, s.location.lat, s.location.lng)
            }));
        } else {
            supply = supply.map(s => ({
                ...s.toObject(),
                distance: (Math.random() * 8 + 2).toFixed(1) + "km"
            }));
        }
        res.json(supply);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/blood-supply/:id/claim', async (req, res) => {
    try {
        const { claimerName } = req.body;
        const bs = await BloodSupply.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { claimedBy: claimerName }, status: 'Reserved' },
            { new: true }
        );
        res.json(bs);
    } catch(err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Trigger nodemon update

module.exports = app;
