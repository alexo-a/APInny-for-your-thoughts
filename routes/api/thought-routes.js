const router = require('express').Router();
const {
    addThought,
    getAllThoughts,
    getOneThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// /api/thoughts
router.route("").post(addThought).get(getAllThoughts)

router.route("/:thoughtId").get(getOneThought).put(updateThought).delete(deleteThought)
router.route("/:thoughtId/reactions").post(addReaction).delete(deleteReaction)

module.exports = router;