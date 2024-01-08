const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/SocialNetworkAPI');

module.exports = mongoose.connection;