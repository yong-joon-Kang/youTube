const express = require('express');
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

//const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

//START::저장할 파일 관련, 속성 세팅
var storage = multer.diskStorage({
    destination: (req, file, cb) => { /* destination = 파일 업로드시 어디에 저장이 될지 */
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4' && ext !== '.png') {
            return cb(res.status(400).end('only png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
})

const upload = multer({ storage: storage }).single("file");
//END::저장할 파일 관련, 속성 세팅



//=================================
//             User
//=================================

router.post('/uploadfiles', (req, res) => {
    
    // 클라이언트에서 받은 비디오를 서버에 저장한다.
    upload(req, res, err => {
        if(err){
            return res.json({ success: false, err})
        }
        return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
    })
})

router.get('/getVideos', (req, res) => {

    // 비디오를 DB에서 가져와서 클라이언트로 보낸다.

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if(err) return res.status(400).send(err);
            res.status(200).json({ success:true, videos })
        })
    
})

router.post('/getSubscriptionVideos', (req, res) => {
    // 로그인 userID로 구독자의 userID를 구한다.
    Subscriber.find({ userFrom: req.body.userFrom })
        .exec((err, subsInfo) => {
            if(err) return res.status(400).send(err);
            const subsArr = []; // 구독자 userID 배열

            subsInfo.map((subscriber, i) => { // 여러명의 구독자를 map으로 subscriber에 하나씩 담아서 subsArr배열에 push 
                subsArr.push(subscriber.userTo)
            })

            //res.status(200).json({ success:true, subsInfo})
            

            // 구독자 userID(하나 또는 다수)의 Video들을 가져온다
            Video.find({ writer : { $in: subsArr } }) // $in -> 여러개의 값을 담을 수 있음
            .populate('writer')
            .exec((err, videos) => {
                if(err) return res.status(400).send(err);
                res.status(200).json({ success:true, videos })
            })
        })
    
    
    
})

router.post('/uploadVideo', (req, res) => {
    
    // 비디오 정보들을 db에 저장한다.
    const video = new Video(req.body) // req.body -> 모든 variables의 정보를 video에 담아준다

    video.save((err, doc) => { // video의 정보를 db에 저장한다.
        if(err) return res.json({ success: false, err })
        res.status(200).json({ success: true })
    })
})

router.post('/getVideoDetail', (req, res) => {
    Video.findOne({ "_id" : req.body.videoId }) // 요청받은 id로 DB의 Video Collection(table)의 _id를 찾겠다.
        .populate('writer')
        .exec((err, videoDetail) => {
            console.log(videoDetail)
            if(err) return res.status(400).send(err)
            return res.status(200).json({ success: true, videoDetail })
        })
    
})

router.post('/thumbnail', (req, res) => {
    
    // 썸네일 생성, 비디오 러닝타임 가져오기

    // 비디오 정보 가져오기
    let filePath ="";
    let fileDuration ="";

    ffmpeg.setFfmpegPath("C:\\Program Files\\ffmpeg-5.0.1-full_build-shared\\bin\\ffmpeg.exe");
    ffmpeg.ffprobe(req.body.url, function(err, metadata){
        console.dir(metadata);
        console.log(metadata.format.duration);

        fileDuration = metadata.format.duration;
    })

    // 썸네일 생성
    ffmpeg(req.body.url) /* uploads 폴더 */
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function () { /* 썸네일을 저장에 성공 시 */
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration}) /* fileDuration = 파일 러닝타임 */
        })
        .on('error', function (err) {
            console.log(err);
            return res.json({ success: false, err })
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size:'320x240',
            // %b input basename ( filename w/o extension ) 확장자는 제외
            filename:'thumbnail-%b.png'
        });
})
module.exports = router;
