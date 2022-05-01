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