const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vvsc7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carCollections = client.db('XtremeCar').collection('cars')

        // all cars api
        app.get('/cars', async(req, res)=>{
            const query = {};
            const cursor = carCollections.find(query);
            const cars = await cursor.toArray();
            res.send(cars)
        })

        // Data format
        // {
        //     "name":"Honda Civic 2022",
        //     "images":"https://raw.githubusercontent.com/SamiulxHasanx07/xtreme-cars-images/main/cars/2022-honda-civic.jpg",
        //     "price":"35000",
        //     "qty":"80",
        //     "supplie": "Honda",
        //     "des":"Best wolrd wide car brand and car provider"
        //     }
        app.post('/cars', async(req, res)=>{
            const data = req.body;
            const result = await carCollections.insertOne(data);
            res.send(result)
        })

    }
    finally {

    }
}


run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Running')
})


app.listen(port, () => {
    console.log('Server Running Port: ', port);

})