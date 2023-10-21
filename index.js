const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cit9nsb.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();

    const productCollection= client.db('techXpressDB').collection('brandCollection');
    const cartCollection = client.db("techXpressDB").collection("cartCollection");

 
    app.post('/addproduct', async (req, res) => {
        const newProduct = req.body;
        console.log(newProduct);
        const result = await productCollection.insertOne(newProduct);
        res.send(result);
    })

 
        app.post("/myCart", async (req, res) => {
          const product = req.body;
          console.log("new product", product);
          const cartItemResult = await cartCollection.insertOne(product);
    
          res.send(cartItemResult);
        });



    app.get("/myCart", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


       app.delete("/myCart/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: id };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
      })

       
    app.get("/addproduct", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

        
        app.get("/addproduct/:brandName", async (req, res) => {
          const brand = req.params.brandName;
          const query = { brandName: brand };
          const result = await productCollection.find(query).toArray();
          res.send(result);
        });
    
    
    
        app.put("/updateProduct/:id", async (req, res) => {
          const id = req.params.id;
          const updatedProduct = req.body;
          const filter = { _id: new ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
            $set: {
              image: updatedProduct.image,
              name: updatedProduct.name,
              brandName: updatedProduct.brandName,
              type: updatedProduct.type,
              price: updatedProduct.price,
              shortDescription: updatedProduct.shortDescription,
              rating: updatedProduct.rating,
            },
          };
          const result = await productCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(result);
        });


         
    app.get("/myCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });


      


   
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('TechXpress server is running')
})

app.listen(port, () => {
    console.log(`TechXpress Server is running on port: ${port}`)
})