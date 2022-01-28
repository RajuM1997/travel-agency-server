const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
require("dotenv").config();

const port = process.env.PORT || 4500;

//Travel Trust
//5t4X5c2rdnkVVpk1

//middlewar
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyrha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("connect");
    const database = client.db("tour_pack");
    const packageCollection = database.collection("package");
    const orderCollection = database.collection("order");
    const blogCollection = database.collection("blog");
    const usersCollection = database.collection("user");
    const reviewCollection = database.collection("review");

    //CREATE A ORDER APL
    app.post("/package", async (req, res) => {
      const data = req.body;
      const result = await packageCollection.insertOne(data);
      res.send(result);
    });

    //GET THE API
    app.get("/package", async (req, res) => {
      const result = await packageCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //CREATE A DYNMICE API
    app.get("/package/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await packageCollection.findOne(query);
      res.json(service);
    });

    //DELETE THE package API
    app.delete("/deletePackage/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await packageCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //CREATE A ORDER APLI
    app.post("/order", async (req, res) => {
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.send(result);
    });

    //GET THE ORDER API
    app.get("/order", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });

    //DELETE THE ORDER API
    app.delete("/deleteOrder/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    //my order get api with email
    app.get("/myOrder/:email", async (req, res) => {
      const result = await orderCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    //DELETE THE ORDER API
    app.delete("/myOrder/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Status Update
    app.put("/statusUpdate/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      // console.log(req.params.id);
      const result = await orderCollection.updateOne(filter, {
        $set: {
          status: req.body.status,
        },
      });
      res.send(result);
      console.log(result);
    });

    //Create A User Api
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    //Get A user api
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    });

    //Put A User Api
    app.put("/users", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    //PUT AND CREATE A ADMIN API
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const filter = { email: user.email };
      const updateDoc = {
        $set: { role: "admin" },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
      console.log(result);
    });

    //CREATE A blog api
    app.post("/blog", async (req, res) => {
      const data = req.body;
      const result = await blogCollection.insertOne(data);
      res.json(result);
      console.log(result);
    });

    //CREATE A blog DYNMICE API
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific service", id);
      const query = { _id: ObjectId(id) };
      const service = await blogCollection.findOne(query);
      res.json(service);
    });

    //GET a blog API
    app.get("/blog", async (req, res) => {
      const result = blogCollection.find({});
      const page = req.query.page;
      const size = parseInt(req.query.size);
      const count = await result.count();
      let blogs;
      if (page) {
        blogs = await result
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        blogs = await result.toArray();
      }

      res.json({
        count,
        blogs,
      });
      // console.log(result);
    });

    //DELETE THE ORDER API
    app.delete("/deleteBlog/:id", async (req, res) => {
      console.log(req.params.id);
      const result = await blogCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/blogStatusUp/:id", async (req, res) => {
      const filter = { _id: ObjectId(req.params.id) };
      console.log(req.params.id);
      const result = await blogCollection.updateMany(filter, {
        $set: {
          status: req.body.status,
          title: req.body.title,
          address: req.body.address,
          expense: req.body.expense,
        },
      });
      res.send(result);
      console.log(result);
    });

    //CREATE A review api
    app.post("/review", async (req, res) => {
      const data = req.body;
      const result = await reviewCollection.insertOne(data);
      res.json(result);
      console.log(result);
    });

    //GET THE ORDER API
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.send(result);
      // console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("node server running");
});
app.listen(port, () => {
  console.log("server is running port", port);
});
