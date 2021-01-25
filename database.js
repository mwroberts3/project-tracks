const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const path = require('path')
const fs = require('fs')

let _db;
let mongodbLink = '';

const mongodbCheck = callback => {
    mongodbLink = fs.readFileSync(path.join(__dirname, 'mongodb-connect.json').toString('utf-8'))

    mongodbLink = JSON.parse(mongodbLink)

    mongodbLink = mongodbLink.mongodbConnect

    callback()
}

const mongoConnect = callback => {
    MongoClient.connect(mongodbLink)
    .then(client => {
        console.log('Connected!')
        _db = client.db()
        callback()
    })
    .catch(err => {
        if (err) throw err
    })
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
exports.mongodbCheck = mongodbCheck