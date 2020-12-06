const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {
    // Endpoint to get posts of people that currently logged in user follows or their own posts
    
    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])

    })

});

router.post('/', authorize,  (request, response) => {
     // Endpoint to create a new post
    var post = {
        userId: request.currentUser.id,
        text: request.body.text,
        media: {
            type: request.body.media.type,
            url: request.body.media.url
        }
    }
    
    PostModel.create(post, (row) => {
        if (row) {
            response.status(200).json(row);
            return;
        }
        response.json([]);
    })
});


router.put('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to like a post
    PostModel.like(request.currentUser.id, request.params.postId, () => {
        return;
    });
    response.json([]);
});

router.delete('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to unlike a post
    PostModel.unlike(request.currentUser.id, request.params.postId, () => {
        return;
    });
    response.json([]);
});

module.exports = router;
