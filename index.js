const express = require('express')
const app = express()
const port = process.env.PORT ||  4000
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})


const MongoClient = require('mongodb').MongoClient;
const ObjectID = require ('mongodb').ObjectID
const uri =  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwmgg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const productCollection = client.db("Finest-Foods").collection("products");
  const ordersCollection = client.db("Finest-Foods").collection("orders");
  app.post('/addProduct',(req,res)=>{
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })
  
  app.post('/addOrder',(req,res)=>{
    const newProduct = req.body;
    ordersCollection.insertOne(newProduct)
    .then(result=>{
      res.send(result.insertedCount>0)
    })
  })


  app.get('/products',(req,res)=>{
    productCollection.find()
    .toArray((err,items)=>{
     res.send(items)
      
    })
  })

  app.get('/orders',(req,res)=>{
   
   ordersCollection.find({email:req.query.email})
    .toArray((err,items)=>{
     res.send(items)
      
    })
  })


  app.delete('/delete/:id',(req,res)=>{
   const id =  ObjectID(req.params.id)
   productCollection.findOneAndDelete({_id:id})
   .then(doc =>res.send(doc))
  })

  app.get('/singleProduct/:id',(req,res)=>{
     productCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err,item)=>{
      res.send(item[0])
    })
  })
 
});


app.listen(port, () => {
  
})