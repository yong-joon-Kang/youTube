const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");


//=================================
//             Comment
//=================================


// 코멘트 저장하기
router.post('/saveComment', (req, res) => {
    
    const comment = new Comment(req.body) // req.body = writer(로그인userId), postId, content

    comment.save(( err, comment ) => {
        if(err) return res.json({ success: false, err })

        Comment.find({'_id' : comment._id}) // _id 를 찾는 이유 : writer의 모든 정보를 저장하기위함
            .populate('writer')
            .exec(( err, result ) => {
                if(err) return res.json({ success: false, err })
                res.status(200).json({ success: true, result })
            })
    })
})

// 해당비디오의 모든 코멘트 가져오기
router.post('/getComments', (req, res) => {
    
        Comment.find({'postId' : req.body.videoId})
            .populate('writer')
            .exec(( err, comments ) => {
                if(err) return res.json({ success: false, err })
                res.status(200).json({ success: true, comments })
            })
})



module.exports = router;
