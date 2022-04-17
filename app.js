const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb } = require('./db')

//init app & middleware
const app = express()
app.use(express.json())

//db connection
let db

connectToDb((err) => {
    if(!err){
        app.listen(3000,() => {
            console.log('app listening on port 3000')
        })
        db = getDb()
    }
})


//routes
app.get('/books',(req,res) => {
    
    let books = []
    
    db.collection('books')
      .find() //cursor toArray forEach
      .sort({ author: 1})
      .forEach(book => books.push(book))
      .then(() => {
          res.status(200).json(books)
      })
      .catch(() => {
          res.status(500).json({error : "Could not fetch the documents"})
      });
    
      //res.json({mssg : "welcome to the api"})
})

app.get('/books/:id',(req,res) => {
    
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: ObjectId(req.params.id)}) //cursor toArray forEach
        .then((doc) => {
            res.status(200).json(doc)
        })
        .catch(() => {
            res.status(500).json({error : "Could not fetch the documents"})
        });   
    }else{
        res.status(500).json({error : "Not a valid the ID"})
    }
      //res.json({mssg : "welcome to the api"})
})

//post
app.post('/books',(req,res) => {
    const book = req.body

    db.collection('books')
      .insertOne(book)
      .then(result => {
          res.status(201).json(result)
      })
      .catch(err => {
          res.status(500).json({err: 'Could not insert the new documents'})
      })
})

//delete
app.delete('/books/:id',(req,res) => {
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)}) //cursor toArray forEach
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({error : "Could not delete the documents"})
        });   
    }else{
        res.status(500).json({error : "Not a valid the ID"})
    }
})

//patch (update)
app.patch('/books/:id' , (req, res) => {
    const updates = req.body

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)},{$set: updates}) //cursor toArray forEach
        .then((result) => {
            res.status(200).json(result)
        })
        .catch(() => {
            res.status(500).json({error : "Could not update the documents"})
        });   
    }else{
        res.status(500).json({error : "Not a valid the ID"})
    }
})