const { User, Thought } = require('../models');

const userController = {
    
    addUser({ body }, res) {
        console.log(body);
        User.create(body)
            .then(dbUserData => {
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    getAllUsers({ }, res) {
        User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },
    getOneUser({ params }, res) {
        console.log(`Getting user ${params.userId}`);
        User.findOne({ _id: params.userId })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    updateUser({ params, body }, res) {
        console.log(`Updating user ${params.userId}`);
        User.findOneAndUpdate({ _id: params.userId }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        console.log(`Deleting user ${params.userId}`);
        User.findOneAndDelete({ _id: params.userId })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .select('-__v')
            //TODO remove thoughts when user is deleted
            /*    .then(deletedUser => {
                    if (!deletedUser) {
                        return res.status(404).json({ message: 'No user with this id!' });
                    }
                    
                    return Pizza.findOneAndUpdate(
                        { _id: params.pizzaId },
                        { $pull: { comments: params.userId } },
                        { new: true }
                    );
                })*/
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No User found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    addFriend({ params}, res) {
        console.log(`Adding friend ${params.friendId} to user ${params.userId}`);
        if (User.exists({ _id: params.userId }))
        User.findOneAndUpdate({ _id: params.userId }, { $push: { friends: params.friendId } }, { new: true })
            
        User.findOneAndUpdate({ _id: params.friendId }, { $push: { friends: params.userId } }, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },
    deleteFriend({ params}, res) {
        console.log(`Removing friend ${params.friendId} from user ${params.userId}`);
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId } }, { new: true })
 /*           .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));*/
        console.log(`Removing friend ${params.userId} from user ${params.friendId}`);
        User.findOneAndUpdate({ _id: params.friendId }, { $pull: { friends: params.userId } }, { new: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this id!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }
}
    module.exports = userController;