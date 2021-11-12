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
        // const productCollection = database.collection('products');
        const exploreCollection = database.collection('explore');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('reviews');

        // GET API
        // app.get('/products', async(req, res) =>{
        //     const cursor = productCollection.find({});
        //     const products = await cursor.toArray();
        //     res.send(products);
        // })
        // GET API
        app.get('/explore', async(req, res) =>{
            const cursor = exploreCollection.find({});
            const explores = await cursor.toArray();
            res.send(explores);
        })
        //DELETE Explore API
        app.delete('/explore/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id) };
            const result = await exploreCollection.deleteOne(query);
            console.log('Deleting User With Id:',result);
            res.json(result);
        });
        //Order POST API
        app.post('/explore', async (req, res) => {
            const explore = req.body;
            const result = await exploreCollection.insertOne(explore)
            console.log(result);
            res.json(result);
        });
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
        });
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
        //Admin API
        app.put('/users/admin', async(req, res) =>{
            const user = req.body;
            console.log('put',user);
            const filter = { email: user.email };
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })
        app.get('/users/:email', async(req, res) =>{
           const email = req.params.email;
           const  query = { email: email };
           const user = await usersCollection.findOne(query);
           let isAdmin = false;
           if(user?.role === 'admin'){
               isAdmin=true;
           }
           res.json({ admin: isAdmin });
        })
        //Review POST API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review)
            console.log(review);
            res.json(result);
        });
        //review GET API
        app.get('/reviews', async(req, res) =>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        });
        //
        app.get('/orders', async(req, res) =>{
            const cursor = orderCollection.find();
            const allOrder = await cursor.toArray();
            res.send(allOrder);
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