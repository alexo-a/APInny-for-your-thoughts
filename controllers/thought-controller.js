const { User, Thought } = require('../models');

const thoughtController = {

    addThought({ body }, res) {
        Thought.create(body)

        
            .then(dbUserData => {
                let thoughtID = dbUserData._id.toString()
                return User.findOneAndUpdate(
                    { username: body.username },
                    { $push: { thoughts: thoughtID } },
                    { new: true }
                )
            })
            .then(dbUserData => {
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    getAllThoughts({ }, res) {
        Thought.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    getOneThought({ params }, res) {
        console.log(`Getting thought ${params.thoughtId}`);
        Thought.findOne({ _id: params.thoughtId })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No Thought found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        console.log(`Updating thought ${params.thoughtId}`);
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        console.log(`Deleting user ${params.thoughtId}`);
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        console.log(`Adding reaction to thought ${params.thoughtId}`);
        console.log(body)
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $push: { reactions: body } }, 
            { new: true, runValidators: true  }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteReaction({ params, body }, res) {
        console.log(`Removing reaction ${body.reactionId} from thought ${params.thoughtId}`);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId }, 
            { $pull: { reactions: {_id: body.reactionId} } }, 
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }
}


pushThought = function(id) {
    
}
module.exports = thoughtController;