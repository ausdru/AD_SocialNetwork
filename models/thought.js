const { Schema, model, mongoose } = require('mongoose');

function dateFormat(createdAtVal) {
    return createdAtVal.toDateString(); 
}

// Create the ReactionSchema
const ReactionsSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        validate: [({ length }) => length <= 280, 'Reaction must be less than 280 characters.']
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    }
},
{
    toJSON: {
        getters: true
    }
}
);

const ThoughtSchema = new Schema({
    thoughtText: {
        type: String,
        required: true,
        validate: [({ length }) => length <= 280, 'Thought must be less than 280 characters.']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    },
    username: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reactions: [ReactionsSchema]

},
{
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
}
);

ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;