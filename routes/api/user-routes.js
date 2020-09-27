const router = require('express').Router();
const {
    addUser,
    getAllUsers,
    getOneUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// /api/users
router.route("").post(addUser).get(getAllUsers)
router.route("/:userId").get(getOneUser).put(updateUser).delete(deleteUser)
router.route("/:userId/friends/:friendId").post(addFriend).delete(deleteFriend)


module.exports = router;