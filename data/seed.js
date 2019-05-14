const mongoCollections = require("./collections");
const bcrypt = require('bcrypt');
const ObjectID = require('mongodb').ObjectID;
const candidates = mongoCollections.candidates;
const employers = mongoCollections.employers;
const jobs = mongoCollections.jobs;
const messages = mongoCollections.messages;

const seedCandidates = async() => {
    const candidatesCollection = await candidates();
    candidatesCollection.insertMany([
        {
            _id: new ObjectID("5cdafc88770f37292a21461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("5cdafc88770f37a56a21461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("2fecfc88770f37292a21461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("5cdafc51f0ec7a292a21461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("1a0f963cebf25619aecbd0d6"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("5cdafc88770f37292a22101e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("777caef8770f37292a21461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("5cdafc88770f31134fec461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("5cdafc88770f37981bae061e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("000192cf25eab6793bdfce10"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("5cdafc88770f193758fe62ac"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        },
        {
            _id: new ObjectID("3782fb9e8a1c37292a21461e"),
            firstName: "",
            lastName: "",
            email: "",
            password: bcrypt.hashSync("Password123", 16),
            skills: [],
            experience: [],
            profileImg: "default.png"
        }        
    ])
};

const seedEmployers = async() => {
    const employersCollection = await employers();
    employersCollection.insertMany([
        {
            _id: new ObjectID("401a93ecb4df19ee6f7afe29"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("401a93ecb4df1897fec16eac"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("401a93ecb4df19e9292938f9"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("401a93ecb4df191191946afe"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("401a93ecb4df8293feb271ea"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("401acef261fbd9de6f7afe29"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("401a93ec56382dbe281faa70"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
        {
            _id: new ObjectID("1019283fbe819afbe921dfe1"),
            name: "",
            email: "",
            description: "",
            password: bcrypt.hashSync("Password123", 16),
            profileImg: "default.png",
            conversations = []
        },
    ])
};

const seedJobs = async() => {
    const jobsCollection = await jobs();
    jobsCollection.insertMany([
        {
            _id: new ObjectID("aa982feb2738adb37ef19201"),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID("aa982feb273819832feb1231"),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID("aa982fe12837189783efebee"),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        },
        {
            _id: new ObjectID(),
            name: "",
            description: "",
            open: true,
            skills: [],
            owner: ""  
        }
    ])
};

// const seedMessages = async() => {
//     const messagesCollection = await messages();
//     messagesCollection.insertMany([
//         {
//             _id: new ObjectID(),
//             senderId: new ObjectID(),
//             receiverId: new ObjectID(),
//             content: ""
//         },
//         {
//             _id: new ObjectID(),
//             senderId: new ObjectID(),
//             receiverId: new ObjectID(),
//             content: ""
//         },
//         {
//             _id: new ObjectID(),
//             senderId: new ObjectID(),
//             receiverId: new ObjectID(),
//             content: ""
//         },
//         {
//             _id: new ObjectID(),
//             senderId: new ObjectID(),
//             receiverId: new ObjectID(),
//             content: ""
//         },
//         {
//             _id: new ObjectID(),
//             senderId: new ObjectID(),
//             receiverId: new ObjectID(),
//             content: ""
//         },
//         {
//             _id: new ObjectID(),
//             senderId: new ObjectID(),
//             receiverId: new ObjectID(),
//             content: ""
//         },
//     ])
// };

module.exports = {
    seedCandidates,
    seedEmployers,
    seedJobs
};