const {Schema, model } = require('mongoose')

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    onBlog: {
        type: Schema.Types.ObjectId,
        ref: 'blog'
    }
}, {timestamps: true})

const Comment = model("comment", commentSchema);

module.exports = {Comment}