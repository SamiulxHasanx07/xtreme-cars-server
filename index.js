const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        //http://localhost:5000/cars
        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carCollections.find(query);
            const cars = await cursor.toArray();
            res.send(cars)
        })

        //single car api
        //http://localhost:5000/car/id
        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id)};
            const result = await carCollections.findOne(query);
            res.send(result);
        })

        // Post API
        // Data format
        // {
        //     "name":"Honda Civic 2022",
        //     "img":"https://raw.githubusercontent.com/SamiulxHasanx07/xtreme-cars-images/main/cars/2022-honda-civic.jpg",
        //     "price":"35000",
        //     "qty":"80",
        //     "supplie": "Honda",
        //     "brand": "Honda"
        //     "des":"Best wolrd wide car brand and car provider"
        //     }
        app.post('/cars', async (req, res) => {
            const data = req.body;
            const result = await carCollections.insertOne(data);
            res.send(result)
        })

        // data format
        // {
        // "name":"Samiul Hasan",
        // "img":"https://raw.githubusercontent.com/SamiulxHasanx07/xtreme-cars-images/main/cars/2022-honda-civic.jpg",
        // "price":"888888",
        // "qty":"01",
        // "supplier": "Audi",
        // "brand":"Audi",
        // "des":"Best wolrd wide car brand and car provider"
        // }
        // Update Car Details API
        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const car = req.body;
            const { name, img, price, qty, supplier, brand, des } = car;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: name, img: img, price: price, qty: qty, supplier: supplier, brand: brand, des: des
                },
            };
            const result = await carCollections.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        // update single car qty
        // data format
        // {
        //     "newQty":"50"
        // }
        app.put('/carqty/:id', async (req, res)=>{
            const id = req.params.id;
            console.log(id);
            const data = req.body;
            const {newQty} =  data;
            console.log(data);
            const filter = {_id:ObjectId(id)};
            const options = {upsert:true}
            const updateDoc = {
                $set:{
                    qty: newQty
                }
            }
            const result = await carCollections.updateOne(filter, updateDoc, options)
            res.send(result);
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