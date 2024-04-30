const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Data = require('./models/item');
const bodyParser = require('body-parser');
const axios = require('axios');


const app = express();

app.use(cors());

app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// connection to mongodb
mongoose.connect('mongodb://localhost:27017/test').then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});


app.post('/data/:uniqueCode', async (req, res) => {
    // Extracting unique code and form data
    const uniqueID = req.params.uniqueCode;
    const formData = req.body;

    // Variable declarations
    let lat, lon, mapUrl;

    try {
        // Convert location to latitude and longitude
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${formData.location}`);
        const data = await response.data
        if (data.length > 0) {
            lat = data[0].lat;
            lon = data[0].lon;
            mapUrl = `https://www.google.com/maps?q=${lat},${lon}`;
        } else {
            console.log("No results found");
        }
    } catch (error) {
        console.error("Error fetching location data:", error);
        return res.status(500).json({ error: error.message });
    }

    // Storing into database
    try {
        const newData = await Data.create({
            uniqueCode: uniqueID,
            metaData: {
                newsUrl: formData.newsUrl,
                mapUrl: mapUrl,
                latitude: lat,
                longitude: lon,
                locationName: formData.location,
                category: formData.category,
            }
        });

        res.json(newData)
    } catch (err) {
        console.error('Error storing data in MongoDB', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/data/:uniqueCode', async (req, res) => {
    const uniqueCode = req.params.uniqueCode;

    try {
        const data = await Data.findOne({ uniqueCode });
        if (!data) {
            return res.status(404).send('Data not found');
        }
        res.json(data.metaData);
    } catch (err) {
        console.error('Error retrieving data from MongoDB', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/data',async (req,res) =>{
    try {
        const category = req.query.category;
        let data;

        if (category && category !== "all") {
            data = await Data.find({ 'metaData.category': category }).sort({ _id: -1 });
        } else {
            data = await Data.find().sort({ _id: -1 });
        }
        if (!data || data.length === 0) {
            return res.status(404).send('No data found');
        }

        res.json(data);
    } catch (err) {
        console.error('Error retrieving data from MongoDB', err);
        res.status(500).send('Internal Server Error');
    }
})
