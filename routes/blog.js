const express = require('express')
const multer = require('multer')
const path = require('path')
const { Blog } = require('../models/blog')
const { Comment } = require('../models/comment')


const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const filename = Date.now() + '-' + file.originalname;
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

router.get('/yourBlog', async(req,res) => {
  const user = req.user

  const allBlog = await Blog.find({createdBy: user._id})
  return res.render('home',{
    user,
    allBlog
  } )
})

router.route('/add-new-blog')
.get( async(req,res) => {
    return res.render('addBlog', {user: req.user})
})

router.route('/')
.post( upload.single('coverImage') ,async (req,res) => {
    // console.log('fileupload: ',req.file)
    const {title, body} = req.body

    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    })

    // console.log('blog : ', blog)
    return res.redirect('/')
})

router.route('/:blogID')
.get(async(req,res) => {
  // return the blog for requested id
  const id = req.params.blogID;
  const blog = await Blog.findById(id).populate('createdBy')
  const comment = await Comment.find({onBlog: id}).populate('createdBy')

  return res.render('blog', {
    blog,
    user: req.user,    
    comments: comment,
  })

})

router.route('/comment/:blogID')
.post(async(req,res) => {
  const {content} = req.body

  await Comment.create({
    content,
    onBlog: req.params.blogID,
    createdBy: req.user._id
  })

  return res.redirect('back')
})

module.exports = router