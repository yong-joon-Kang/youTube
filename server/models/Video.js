const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        type:Schema.Types.ObjectId, // User.js를 참조하여 그 속의 모든 정보를 읽을 수 있음
        ref: 'User'
    },
    title: {
        type:String,
        maxlength:50,
    },
    description: {
        type: String,
    },
    privacy: {
        type: Number,
    },
    filePath : {
        type: String,
    },
    catogory: String,
    views : {
        type: Number,
        default: 0 
    },
    duration :{
        type: String
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true }) // timestamps -> 생성 날짜, 수정 날짜 update 되게 함


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }