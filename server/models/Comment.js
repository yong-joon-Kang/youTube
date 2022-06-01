const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref:'Video'
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    content: {
        type: String
    }
}, { timestamps: true }) // timestamps -> 생성 날짜, 수정 날짜 update 되게 함


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }