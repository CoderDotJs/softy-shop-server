const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bqqvk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connection success")

        const database = client.db("softy-shop");
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('orders');
        const reviewCollection = database.collection('review');

        // get all products api 
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })
        //get api one Product by id
        app.get('/product/:id', async (req, res) => {
            const id = parseInt(req.params.id);
            const query = { id: id };
            const result = await productsCollection.findOne(query);

            res.send(result);

        })

        //get product by category
        app.get('/products/category/:category', async(req,res) =>{
            const category = req.params.category;
            const query = {category: category}
            const result = await productsCollection.find(query).toArray();

            res.send(result);
        })

        // get all user api 
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })
        // get user by email api 
        app.get('/user/:email', async (req, res) => {
            
            const email = req.params.email;
            const query = { email: email}
            const result = await usersCollection.find(query).toArray();

            res.send(result);
        })
        //post user api 
        app.post('/addUser', async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })


        //Order api 
          app.post('/addOrder', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })
        //get order list for user api
        app.post('/myOrder', async (req, res) => {
            const email = req.body;
            // const query = {};
            const result = await orderCollection.find(email).toArray();
            res.send(result)
        })
        //get all order
        app.get('/allOrders', async (req, res) => {
            const query = {};
            const result = await orderCollection.find(query).toArray();
            res.send(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send("Softy shop");
})

app.listen(port, () => {
    console.log("Listening port: ", port);
})