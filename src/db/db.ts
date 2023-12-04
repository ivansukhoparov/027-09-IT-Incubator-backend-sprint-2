import {MongoClient} from "mongodb";
import {mongoUri} from "../utils/comon";


export const client = new MongoClient(mongoUri)



export const runDB = async () => {
    try {
        // Connect to server
        await client.connect();
        // Check connection
        await client.db("admin").command({ping: 1});
        console.log("Mongo server connection successful");
    }catch  {
        await client.close()
        console.log("Mongo server connection failed")
    }
}

