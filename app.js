const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://sonalibharadwaj1998:MaRULijIETvDWEPJ@cluster0.bzln08b.mongodb.net/';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Connection error:', error);
});

const candidateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    skills: { type: String, required: true },
    yearsOfExperience: { type: Number, required: true },
    videoInterviewResults: { type: String, required: true },
    codingResults: { type: String, required: true },
});

const Candidate = mongoose.model('Candidate', candidateSchema);


app.post('/api/candidates', async (req, res) => {
    try {
        const newCandidate = new Candidate(req.body);
        const savedCandidate = await newCandidate.save();
        res.status(201).json(savedCandidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/candidates/:id', async (req, res) => {
    try {
        const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(updatedCandidate);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/candidates/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
