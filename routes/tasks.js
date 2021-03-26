const { assert } = require('console');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var Task = require('../models/task');
var TaskImage = require('../models/taskimage');
var isAuth = require('../functions/isAuth');
var isUser = require('../functions/isUser');
var multer = require('multer');
var path = require('path');
var Reply = require('../models/reply');
var ReplyImage = require('../models/replyimage')
var storage = multer.diskStorage({ 
    destination: function(req, file, cb){
        cb(null, __dirname + '/../public/images')
    },
    filename: function (req, file, cb){
        var newname = file.fieldname + '-' + req.session.user._id.toString() + '-' + Date.now() + path.extname(file.originalname);
        // console.log(file.path)
        file.originalname = newname;
        cb(null, newname);
    }
});
var upload = multer({ storage: storage});
// var Schema = mongoose.Schema;

// var taskSchema = new Schema({
//     title: {type: String, required: true},
//     description: {type: String, required: true},
//     timestamp: {type: Date, default: Date.now()},
//     creator: {type: String, required: true},
// });

// var Task = mongoose.model('Task', taskSchema);

router.get('/', function(req, res, next){
    Task.countDocuments({}).exec(function(err, count){
        
    });
    var tasks;
    Task.find({}).sort({timestamp:-1}).lean().exec(function(err, result){
        tasks = result;
        console.log(typeof(tasks));
        res.render('tasks', {title: 'Tasks', tasks: tasks})
    });
    
});

router.get('/create', function(req, res, next){
   
    res.render('tasks/create');
});

router.get('/t/:id', function(req, res, next){
    
    var id = req.params.id; 
    console.log(id)
    Task.find({_id: id}).lean()
    .exec()
    .then((result) =>{
        if (result[0].creatorId === req.session.user._id.toString()){
            var iscreator = true;
        }
        else{
            var iscreator = false;
        }
        // var imagepaths;
        TaskImage.find({taskid: id}).lean()
        .exec()
        .then((images) =>{

            if (iscreator){
                Reply.find({active: true, replytotask: id}).sort({timestamp:1}).lean().exec()
                .then((replies)=>{
                    console.log(replies);
                    res.render('tasks/display', {tasks: result, images: images, iscreator: iscreator, replies: replies})
                })
                .catch();
            }
            else {
            // imagepaths = images;
            
            console.log(result[0].creatorId + ' ' + req.session.user._id)
            console.log(result);
            console.log(images);
            console.log(iscreator);
            res.render('tasks/display', {tasks: result, images: images, iscreator: iscreator, replies: null})
            }
        })
        .catch()
    })
    .catch();
    
});

router.post('/t/:id/reply', upload.single('image'), function(req, res, next){
    Task.findOne({_id:req.params.id})
    .exec()
    .then((result) => {
        if (result.creatorId === req.session.user._id.toString()) {
            throw new Error('Creator can\'t reply to own task');
        }
        else{
            if (req.file) {var filepath = req.file.originalname}
            else{var filepath = null}
            var reply = new Reply({
                replytotask: req.params.id,
                filepath: '/images/' + filepath,
                textcontent: req.body.textreply,
                creator: req.session.user.username,
                creatorId: req.session.user._id
            });
            reply.save()
            .then(//(saveresult) => {
                // if (req.file){
                //     var replyimage = new ReplyImage({ 
                //         replyid: reply._id,
                //         filepath: req.file.originalname,
                //         creator: reply.creator
                //     });
                //     replyimage.save()
                //     .then((image)=>{
                        
                //     })
                //     .catch()
                // }
                // else {

                // }
            // })
            )
            .catch()
        }})
    .catch()
})

router.get('/t/:id/nextreply', function(req, res, next){
    console.log('entered correct route')
    Task.find({_id: req.params.id}).lean().exec()
    .then((result) =>{
        if (req.session.user._id.toString() === result[0].creatorId){
            Reply.findOneAndUpdate({active: true, replytotask: req.params.id}, {active:false}).sort({timestamp:1}).exec()
            .then((reply)=>{
                reply.active = false;
                reply.save().then((saved)=> {

                    Reply.find({active:true, replytotask: req.params.id}).sort({timestamp:1}).lean().exec()
                    .then((replies) =>{

                        // reply.shift()
                        console.log(replies)
                        TaskImage.find({taskid: req.params.id}).lean().exec()
                        .then((images)=>{
                            // res.render('tasks/display', {tasks: result, iscreator: true, images: images, replies: replies})
                            res.json({tasks: result, iscreator: true, images: images, replies: replies})
                    }).catch()
                    
                    
                    
                    }).catch((err) => {
                        res.json({tasks: result, iscreator: true, images: null, replies: null})

                    })
                }).catch()
            })
            .catch((err) =>{
                TaskImage.find({taskid: req.params.id}).exec()
                        .then((images)=>{
                            res.render('tasks/display', {tasks: result, iscreator: true, images: images, replies: []})
                            // res.json({replies: , })

                    }).catch()
            })
        }
    })
    .catch()
    
})



router.post('/create', isAuth, upload.array('image', 10), function(req, res, next){
    if (req.body.title && req.body.description){

    
        var task = new Task({
                        title: req.body.title,
                        description: req.body.description,
                        timestamp: Date.now(),
                        creator: req.session.user.username,
                        creatorId: req.session.user._id
                    });
        task.save().then((result) => {
            for (var i = 0; i < req.files.length; i++){
                var image = new TaskImage({
                                taskid: task._id,
                                filepath: '/images/' + req.files[i].originalname,
                                creator: task.creator,
                                creatorId: task.creatorId
                                });
                image.save().then();
            }
            // TaskImage.find({}).exec()
            // .then((result)=>{
            // console.log(result);
            // }
            // )
            // .catch()
        })
        .catch();


        Task.find({}).exec()
        .then(function(err, result){
            console.log(result);
            res.redirect('/tasks')
        })
        .catch();
        
    }
    else {
        console.log('exception')
        if (!req.body.title){
            
        }
        if (!req.body.description){

        }

    }
});


router.get('/:username', isAuth, function(req, res, next){
    console.log('infunc')
    Task.find({creator: req.params.username}).sort({timestamp:-1}).lean()
    .exec()
    .then(result =>
        res.render('tasks', {tasks: result}) 
    )
    .catch(err =>
        console.log(err)
    )
})

module.exports = router;