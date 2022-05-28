const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref:'User'
    }
}, { timestamps: true }) // timestamps -> 생성 날짜, 수정 날짜 update 되게 함


const Subscriber = mongoose.model('Subscriber', subscriberSchema);

module.exports = { Subscriber }