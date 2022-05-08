const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())

// verify user token
function verifyJWT(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ message: 'You Cant Access Data' })
    }
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).send({ message: 'You Cant Access Data, Forbidden authorization' })
        }
        req.decoded = decoded;
        next();
    })
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vvsc7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const carCollections = client.db('XtremeCar').collection('cars')

        // all cars api
        app.get('/cars', async (req, res) => {
            const query = {};
            const cursor = carCollections.find(query);
            const cars = await cursor.toArray();
            res.send(cars)
        })

        // User Login
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '2d'
            })
            res.send({ accessToken })
        })

        //single car api
        app.get('/car/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await carCollections.findOne(query);
            res.send(result);
        })

        // my item api
        app.get('/myitems/:email', verifyJWT, async (req, res) => {
            const decodedEmail = req.decoded.email;
            const searchData = req.params.email;
            if (decodedEmail === searchData) {
                const query = { email: searchData };
                const cursor = carCollections.find(query);
                const result = await cursor.toArray();
                res.send(result);
            }else{
                res.status(403).send({message:'forbidden access you cant access this data'})
            }

        })

        // Post API
        app.post('/car', async (req, res) => {
            const data = req.body;
            const result = await carCollections.insertOne(data);
            res.send(result)
        })

        // Update Car Details API
        app.put('/car/:id', async (req, res) => {
            const id = req.params.id;
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
        app.put('/carqty/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const { newQty } = data;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    qty: newQty
                }
            }
            const result = await carCollections.updateOne(filter, updateDoc, options)
            res.send(result);
        })

        // Delete Car
        app.delete('/car', async (req, res) => {
            const id = req.query._id;
            const filter = { _id: ObjectId(id) }
            const result = await carCollections.deleteOne(filter);
            res.send(result)
            console.log(id);

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