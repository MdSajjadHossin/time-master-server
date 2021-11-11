const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
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