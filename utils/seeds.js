const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thought');

mongoose.connect('mongodb://localhost:27017/SocialNetworkAPI');

const users = [
    {
        username: "johnny_appleseed",
        email: "johnny.appleseed@example.com"
    },
    {
        username: "abraham_lincoln",
        email: "abraham.lincoln@example.com"
    }
];

const thoughts = [
    {
        thoughtText: "Plant them! Plant them EVERYWHERE!",
        username: "johnny_appleseed"
    },
    {
        thoughtText: "Cant wait for this play tonight lol",
        username: "abraham_lincoln"
    }
];

let userIdMap = {};
let updatedThoughts = [];

User.deleteMany({})
    .then(() => User.insertMany(users))
    .then(data => {
        console.log(data.length + " users' data has been inserted.");

        data.forEach(user => {
            userIdMap[user.username] = user._id;
        });

        updatedThoughts = thoughts.map(thought => ({
            ...thought,
            userId: userIdMap[thought.username]
        }));

        return Thought.deleteMany({});
    })
    .then(() => Thought.insertMany(updatedThoughts))
    .then(data => {
        console.log(data.length + " thoughts' data has been inserted.");

        const thoughtPromises = data.map(thought => {
            return User.updateOne(
                { _id: thought.userId },
                { $push: { thoughts: thought._id } }
            );
        });

        return Promise.all(thoughtPromises);
    })
    .then(() => {
        console.log("Users have been updated with thoughts.");
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });