import mongo from 'mongodb';

const { MongoClient } = mongo;

const url = process.env.MONGO_URL;

const client = new MongoClient(url, {useNewURLParser: true});

export async function connectDb(){
    try{
        await client.connect();
        //confirm connection to DB
        await client.db('admin').command({ ping: 1 });
        console.log('Connected successfully to DB server');
    }catch(e){
        console.error('e', e)
        //if there is a problem close the connection to the DB
        await client.close()
    }
}