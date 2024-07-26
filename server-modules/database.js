const { MongoClient } = require("mongodb");
const hash = require("sha256");

const uri = "mongodb://localhost:27017/";
const clientDB = new MongoClient(uri);

module.exports = {
    async connectDatabase() {
        return await clientDB.connect();
    },

    async getMainDatabase() {
        const isOnline = await this.connectDatabase();
        if (isOnline == false) return undefined;

        return await clientDB.db("test");
    },

    async listDatabases() {
        const isOnline = await this.connectDatabase();
        if (isOnline == false) return;

        const databasesList = await clientDB.db().admin().listDatabases();

        console.log("databases:");
        databasesList.databases.forEach((db) => console.log(` - ${db.name}`));

        return {
            ok: true,
        };
    },

    async listUsers() {
        const database = await this.getMainDatabase();
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
