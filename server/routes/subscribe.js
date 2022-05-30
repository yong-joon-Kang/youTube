const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");


//=================================
//             Subscribe
//=================================


// 구독자 수 구하기
router.post('/subscribeNumber', (req, res) => {
    Subscriber.find({ 'userTo': req.body.userTo }) // req.body.userTo = writer._id // select * from Subscriber where userTo = req.body.userTo
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        return res.status(200).json({ success: true, subscribeNumber: subscribe.length })
    })
})

// 구독 여부 구하기
router.post('/subscribed', (req, res) => {
    
    Subscriber.find({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom }) // req.body.userTo = writer._id, req.body.userFrom = userId (접속자Id)
    // select * from Subscriber where userTo = req.body.userTo and userFrom = req.body.userFrom
    .exec((err, subscribe) => {
        if(err) return res.status(400).send(err);
        let result = false;
        if(subscribe.length !== 0){ // length가 1이상이면 접속자는 해당 영상 작성자를 구독중인 것
            result = true;
        }
        res.status(200).json({ success: true, subscribed: result })
    })
})

// 구독 취소하기
router.post('/unSubscribe', (req, res) => {
    
    Subscriber.findOneAndDelete({ 'userTo': req.body.userTo, 'userFrom': req.body.userFrom }) // req.body.userTo = writer._id, req.body.userFrom = userId (접속자Id)
    // select * from Subscriber where userTo = req.body.userTo and userFrom = req.body.userFrom
    // delete from Subscriber where  userTo = req.body.userTo and userFrom = req.body.userFrom
    .exec((err, doc) => {
        if(err) return res.status(400).json({ success: false, err });
        res.status(200).json({ success: true, doc })
    })
})

// 구독 하기
router.post('/subscribe', (req, res) => {
    const subscribe = new Subscriber(req.body)

    subscribe.save((err, doc) => {
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})


module.exports = router;
