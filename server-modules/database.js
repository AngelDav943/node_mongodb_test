const { MongoClient } = require("mongodb");
const hash = require("sha256");

const uri = "mongodb://localhost:27017/";
const clientDB = new MongoClient(uri);
let mainDatabase = null;

async function connectDatabase() {
    return await clientDB.connect();
}

async function getMainDatabase() {
    const isOnline = await connectDatabase();
    if (isOnline == false) return undefined;

    if (mainDatabase != null) return mainDatabase

    mainDatabase = await clientDB.db("test");
    return mainDatabase
}

module.exports = {

    async listUsers() {
        const database = await getMainDatabase();
        if (database == undefined) return;

        const usersCollection = await database.collection("users");

        const cursor = usersCollection.find();

        // Print a message if no documents were found
        if ((await usersCollection.countDocuments()) === 0) {
            console.log("No documents found!");
            return;
        }

        let users = [];
        for await (const doc of cursor) {
            const user = {...doc}
            delete user.password
            users.push(user)
        }

        // Print returned documents
        return users;
    },

    async createUserToken(user) {
        return hash(
            user.name.toString() + "token" + user.password.toString()
        )
    },

    async createUser() {

    },

};
