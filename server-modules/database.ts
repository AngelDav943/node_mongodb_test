import { Db, MongoClient, ObjectId, Timestamp } from "mongodb";

export interface user {
    _id?: ObjectId;
    name: string;
    password?: string;
    createdAt: number;
}

export interface statusMessage {
    success: boolean
    message: string
}

const uri = "mongodb://localhost:27017/";
const clientDB = new MongoClient(uri);
let mainDatabase: Db | null = null;

async function connectDatabase() {
    return await clientDB.connect();
}

async function getMainDatabase() {
    const DB = await connectDatabase();
    if (!DB) return undefined;

    if (mainDatabase != null) return mainDatabase

    mainDatabase = await clientDB.db("angeltestdb");
    return mainDatabase
}

const txtEncoder = new TextEncoder();
async function hasher(inputText: string): Promise<string> {
    const encodedInput = txtEncoder.encode(inputText)

    const passDigest = await crypto.subtle.digest(
        { name: "SHA-256" },
        encodedInput
    )
    
    const inputResult = [...new Uint8Array(passDigest)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    return inputResult;
}

export async function listUsers() {
    const database = await getMainDatabase();
    if (database == undefined) return [];

    const usersCollection = await database.collection("users");

    const cursor = usersCollection.find();

    // Print a message if no documents were found
    if ((await usersCollection.countDocuments()) === 0) {
        console.error("No documents found!");
        return [];
    }

    let users: user[] = [];
    for await (const doc of cursor) {
        const user: user = { ...doc } as user
        delete user.password
        users.push(user)
    }

    // Print returned documents
    return users;
}

export async function createUserToken(user: {name: string, password: string}) {
    return hasher(
        user.name.toString() + "token" + user.password.toString()
    )
}

export async function createUser(username: string, password: string): Promise<statusMessage | {success: true, user: user}> {
    const database = await getMainDatabase();
    if (database == undefined) return {
        success: false,
        message: "Database not available"
    };

    const users = database.collection("users")

    const existing = await users.findOne({
        name: username
    })

    if (existing) return {
        success: false,
        message: "Username already in use"
    };

    const hashedPass = await hasher(password);
    const newUser: user = {
        name: username,
        password: hashedPass,
        createdAt: Date.now()
    }

    await users.insertOne(newUser)

    console.log(newUser)

    return {
        success: true,
        user: newUser
    }
}

export async function loginUser(username: string, password: string) {
    const database = await getMainDatabase();
    if (database == undefined) return;

    const hashedPass = await hasher(password);
    const userToken = await createUserToken({ name: username, password: hashedPass});

    const users = database.collection("users");
    const targetUser: user | null = await users.findOne({
        name: username
    }) as user
    if (targetUser == null || targetUser.password == undefined) return;

    const targetToken = await createUserToken({name: targetUser.name, password: targetUser.password})

    console.log(password)
    console.log(targetUser.password)

    if (targetToken !== userToken) return;

    return {
        user: targetUser,
        token: userToken
    };
}

export async function verifyUser(token: string) {

}