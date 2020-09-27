const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

const password = '7OXSVWPiNcIFW1oq';

    const uri = "mongodb+srv://organicUser:7OXSVWPiNcIFW1oq@cluster0.0nyzj.mongodb.net/organicdb?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html')
    })

        client.connect(err => {
        const collection = client.db("organicdb").collection("products");

       app.get('/products',(req, res)=>{
           collection.find({}).limit(4)
           .toArray((err, documents)=>{
               res.send(documents);
           })
       })
        
        app.post("/addProduct",(req,res)=>{

            const products = req.body;
            collection.insertOne(products)
            .then(result=>{
                console.log('data added successfully');
                res.redirect('/');
            })
            //console.log(products);
        })

            app.get('/product/:id',(req, res)=>{
                collection.find({_id: ObjectId(req.params.id)})
                .toArray((err, documents)=>{
                    res.send(documents[0]);
                })
            })

            app.patch('/update/:id',(req,res)=>{
                collection.updateOne({_id: ObjectId(req.params.id)},
                {
                    $set: {price: req.body.price, quantity: req.body.quantity}
                }
                )
               
                .then(result =>{
                    res.send(result.modifiedCount > 0)
                })
            })



            app.delete('/delete/:id',(req, res)=>{
                collection.deleteOne({_id: ObjectId(req.params.id)})
                .then(data=>{
                    res.send(data.deletedCount > 0);
                })
            })
        
        });


        app.listen(3000)