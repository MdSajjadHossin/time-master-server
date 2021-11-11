const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fae7y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        console.log('Database Connected Successfully');
        const database = client.db('time_master');
        const productCollection = database.collection('products');
        const exploreCollection = database.collection('explore');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users');

        // GET API
        app.get('/products', async(req, res) =>{
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })
        // GET API
        app.get('/explore', async(req, res) =>{
            const cursor = exploreCollection.find({});
            const explores = await cursor.toArray();
            res.send(explores);
        })
        //Order POST API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order)
            console.log(order);
            res.json(result);
        });
        //Order GET API
        app.get('/orders', async (req, res) =>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders);
        })
        //Oredr DELETE API
        app.delete('/orders/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);

            console.log('Deleting User With Id:',result);
            res.json(result);
        })
        //User POST API
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })
        //Google Login UPSERT API
        app.put('/users', async(req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello From Time Master!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})