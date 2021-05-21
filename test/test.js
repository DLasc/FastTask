var assert = require('assert');
var request = require('supertest');
const { getMaxListeners } = require('../app');
var app = require('../app');
const router = require('../routes');
var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var Task = require('../models/task');
var User = require('../models/user')
var Reply = require('../models/reply');
const { deepStrictEqual } = require('assert');

//------------------------------------------------------
describe('Mocha tests', function(){


// INDEX.JS TESTS

describe('/ GET', function() {
    it('Should return homepage', function(done) {
        request(app)
        .get('/')
        .expect('Content-type', /html/)
        .expect(res => {
            assert.ok(res.text.includes('Create a Task')); 
            assert.ok(res.text.includes('View Tasks'));
            assert.ok(res.text.includes('Latest Tasks'));
        })
        .expect(200, done)
    });
});


describe('/index GET', function() {
    it('Should return homepage', function(done) {
        request(app)
        .get('/index')
        // .expect('Content-type', /html/)
        // .expect(res => {
        //     assert.ok(res.text.includes('Create a Task')); 
        //     assert.ok(res.text.includes('View Tasks'));
        //     assert.ok(res.text.includes('Latest Tasks'));
        // })
        .expect('Location', '/')
        // .expect(200, done)
        .end(done)
    });
});

//-----------------------------------------------------------------
const agent = request.agent(app)
// USERS.JS TESTS

describe('/users/login GET', function() {
    it('Should return login view', function(done) {
        request(app)
        .get('/users/login')
        .expect('Content-type', /html/)
        .expect(res => {
            // console.log(res.text)
            // assert.ok(res.text.includes('Tasks'));
            assert.ok(res.text.includes("<form action='/users/login' method='post'>"));
        })
        .expect(200, done)
    });
});

describe('/users/signup GET', function() {
    it('Should return sign up view', function(done) {
        request(app)
        .get('/users/signup')
        .expect('Content-type', /html/)
        .expect(res => {
            // console.log(res.text)
            assert.ok(res.text.includes("<form action='/users/signup' method='post'>"));
        })
        .expect(200, done)
    });
});

var timestamp = Date.now();
timestamp = timestamp + 'abc'

describe('/users/signup POST username exists', function(){
    it('Should return view including username already exists error', function(done){
        request(app)
        .post('/users/signup')
        .send({uname: 'joe',
                email: 'randomexample@gmail.com',
            password: 'password',
            cpassword: 'password'})
        .expect(res => {
            assert.ok(res.text.includes("<form action='/users/signup' method='post'>"));
            assert.ok(res.text.includes('Username Taken'));
        })
        .end(done)
    })
})

describe('/users/signup POST email exists', function(){
    it('Should return view including email already exists error', function(done){
        request(app)
        .post('/users/signup')
        .send({uname: 'randomexample',
                email: 'joe@gmail.com',
            password: 'password',
            cpassword: 'password'})
        .expect(res => {
            assert.ok(res.text.includes("<form action='/users/signup' method='post'>"));
            assert.ok(res.text.includes('Account with email exists'));
        })
        .end(done)
    })
})

describe('/users/signup POST password too short', function(){
    it('Should return view including password too short error', function(done){
        request(app)
        .post('/users/signup')
        .send({uname: 'randomexample',
                email: 'randomexample@gmail.com',
            password: 'pas',
            cpassword: 'pas'})
        .expect(res => {
            assert.ok(res.text.includes("<form action='/users/signup' method='post'>"));
            assert.ok(res.text.includes('Password too short'));
        })
        .end(done)
    })
})

describe('/users/signup POST password and confirm password not the same', function(){
    it('Should return view including password and confirm password not the same error', function(done){
        request(app)
        .post('/users/signup')
        .send({uname: 'randomexample',
                email: 'randomexample@gmail.com',
            password: 'passwords',
            cpassword: 'password'})
        .expect(res => {
            assert.ok(res.text.includes("<form action='/users/signup' method='post'>"));
            assert.ok(res.text.includes('Password and Confirm Password not the same'));
        })
        .end(done)
    })
})

describe('/users/signup POST works', function(){
    it('Should return view of tasks and user should have connect.sid cookie', function(done){
        agent
        .post('/users/signup')
        .send({uname: 'test'+timestamp,
                email: 'test'+timestamp+'@gmail.com',
            password: 'password',
            cpassword: 'password'})
        
        .expect('Location', '/tasks')
        .expect(res => {
            // console.log(res.header['set-cookie'])
            assert.ok(!res.header['set-cookie'][0].includes('connect.sid=;'));
            assert.ok(res.header['set-cookie'][0].includes('connect.sid='));
            // assert.ok(res.locals.user.username === 'test'+timestamp);        
        })
        .end(done)
    })
})

describe('/users/logout POST works', function(){
    it('Should redirect to index page with no connect.sid cookie', function(done){
        agent
        .post('/users/logout')
        .expect(res => {
            // console.log(res.header['set-cookie'])
            assert.ok(res.header['set-cookie'][0].includes('connect.sid=;') || 
                        !res.header['set-cookie'][0].includes('connect.sid'));
            // assert.ok(res.locals.user.username === 'test'+timestamp);        
        })
        .expect('Location', '/')
        .end(done)
    })
})

describe('/users/login POST Invalid user', function(){
    it('Should return invalid user error', function(done){
        agent
        .post('/users/login')
        .send({
            uname: 'invaliduser',
            password: 'password'
        })
        .expect(res => {
            // console.log(res.header['set-cookie'])
            assert.ok(res.text.includes('Invalid User'));
            // assert.ok(res.locals.user.username === 'test'+timestamp);        
        })
        .end(done)
    })
});

describe('/users/login POST Invalid password', function(){
    it('Should return invalid password error', function(done){
        agent
        .post('/users/login')
        .send({
            uname: 'test'+timestamp,
            password: 'passwordwrong'
        })
        .expect(res => {
            // console.log(res.header['set-cookie'])
            assert.ok(res.text.includes('Invalid Password'));
            // assert.ok(res.locals.user.username === 'test'+timestamp);        
        })
        .end(done)
    })
});

describe('/users/login POST works', function(){
    it('Should redirect to /tasks with connect.sid cookie', function(done){
        agent
        .post('/users/login')
        .send({
            uname: 'test'+timestamp,
            password: 'password'
        })
        .expect('Location', '/tasks')
        .expect(res => {
            // console.log(res.header['set-cookie'])
            assert.ok(!res.header['set-cookie'][0].includes('connect.sid=;'));
            assert.ok(res.header['set-cookie'][0].includes('connect.sid='));
            // assert.ok(res.locals.user.username === 'test'+timestamp);        
        })
        .end(done)
    })
});

var timestamp2 = Date.now();
var agent2 = request.agent(app)
describe('/users/signup POST 2 works', function(){
    it('Should return view of tasks and user should have connect.sid cookie', function(done){
        agent2
        .post('/users/signup')
        .send({uname: 'test'+timestamp2,
                email: 'test'+timestamp2+'@gmail.com',
            password: 'password',
            cpassword: 'password'})
       
        .expect('Location', '/tasks')
        .expect(res => {
            // console.log(res.header['set-cookie'])
            // while (!res.header['set-cookie']){}
        
            assert.ok(!res.header['set-cookie'][0].includes('connect.sid=;'));
            assert.ok(res.header['set-cookie'][0].includes('connect.sid='));
            
                // assert.ok(res.locals.user.username === 'test'+timestamp);        
        })
        .end(done)
    })
})


//-----------------------------------------------------------------

// TASKS.JS TESTS

describe('/tasks GET', function() {
    it('Should return latest tasks view', function(done) {
        request(app)
        .get('/tasks')
        .expect('Content-type', /html/)
        .expect(res => {
            // console.log(res.text)
            assert.ok(res.text.includes('Tasks'));
            assert.ok(res.text.includes("<div class='tasklist'>"));
        })
        .expect(200, done)
    });
});

describe('/tasks/create GET', function(){
    it('Should return create task view', function(done) {
        request(app)
        .get('/tasks/create')
        .expect('Content-type', /html/)
        .expect(res => {
            // console.log(res.text)
            assert.ok(res.text.includes('Create a Task'));
            assert.ok(res.text.includes("<form action='/tasks/create' method='post' enctype='multipart/form-data'>"));
        })
        .expect(200, done)
    });
})



describe('/tasks/create POST not logged in', function(){
    it('Should redirect to login page', function(done){
        request(app)
        .post('/tasks/create')
        .send({title: 'Test Task ' + timestamp,
               description: "Lorem ipsum",
               value: 1000
            })
        .expect('Location', '/users/login')
        .end(done)
    })

})

describe('/tasks/create POST logged in', function(){
    it('Should create task and redirect to /tasks', function(done){
        agent
        .post('/tasks/create')
        .send({title: 'Test Task ' + timestamp,
               description: "Lorem ipsum",
               value: 1000
            })
        .expect('Location', '/tasks')
        .expect(res =>{
            // console.log(res.text)
            agent.get('/tasks')
            .expect(result =>{
                assert.ok(result.text.includes('test'+timestamp))
            })
        })
        .end(done)
    })
})

describe('/tasks/create POST no title', function(){
    it('Should return no title error', function(done){
        agent
        .post('/tasks/create')
        .send({//title: 'Test Task ' + timestamp,
               description: "Lorem ipsum",
               value: 1000
            })
        // .expect('Location', '/tasks')
        .expect(res =>{
            assert.ok(res.text.includes('No Title'))
        })
        .end(done)
    })
})

describe('/tasks/create POST no description', function(){
    it('Should return no description error', function(done){
        agent
        .post('/tasks/create')
        .send({title: 'Test Task ' + timestamp,
            //    description: "Lorem ipsum",
               value: 1000
            })
        // .expect('Location', '/tasks')
        .expect(res =>{
            assert.ok(res.text.includes('No Description'))
        })
        .end(done)
    })
})

describe('/tasks/create POST no value', function(){
    it('Should return no value error', function(done){
        agent
        .post('/tasks/create')
        .send({title: 'Test Task ' + timestamp,
               description: "Lorem ipsum",
            //    value: 1000
            })
        // .expect('Location', '/tasks')
        .expect(res =>{
            assert.ok(res.text.includes('No Value'))
        })
        .end(done)
    })
})


var taskid;
describe('/tasks/t/id GET ', function(){
    it('Should return the page with the task whose _id is id', function(done){
        
        
        Task.find({creator: 'test'+timestamp}).exec()
            .then(result => {
            // console.log('logging result __________________________')
                taskid = result[0]._id.toString()
            // console.log(result)

            // console.log(id)
        
            agent2
            .get('/tasks/t/'+taskid)
            // .expect('Location', '/tasks')
            .expect(res =>{
                assert.ok(res.text.includes('Test Task ' + timestamp))
            })
            .end(done)
            })
            .catch(err => {
                console.log(err)
            })

        
    })
})

describe('/tasks/t/reply POST', function(){
    it('Should return a success json object', function(done){
        agent2
        .post('/tasks/t/'+taskid+'/reply')
        .send({textreply: 'Test Reply from test' + timestamp2,
    
            })
        // .expect('Location', '/tasks')
        .expect('Content-Type', /json/)
        .expect({success: true})

        .end(done)
    })
})

describe('/tasks/t/reply POST 2', function(){
    it('Should return a success json object', function(done){
        agent2
        .post('/tasks/t/'+taskid+'/reply')
        .send({textreply: 'Test Reply 2 from test' + timestamp2,
    
            })
        // .expect('Location', '/tasks')
        .expect('Content-Type', /json/)
        .expect({success: true})

        .end(done)
    })
})

describe('/tasks/t/reply POST own creator', function(){
    it('Should return creator can\'t reply to own Task', function(done){
        agent
        .post('/tasks/t/'+taskid+'/reply')
        .send({textreply: 'Test Reply from test' + timestamp2,
    
            })
        // .expect('Location', '/tasks')
        // .expect('Content-Type', /json/)
        .expect(res => {
            assert.ok(res.text.includes("Creator can't reply to own Task"))
        })
        // .expect(res =>{
        //     console.log(res.text)
        //     assert.ok(res.text.includes('true'))
        //     assert.ok(res.text.includes('success'))
        // })
        .end(done)
    })
})

describe('/tasks/t/reply POST not logged in', function(){
    it('Should redirect user to the login page', function(done){
        request(app)
        .post('/tasks/t/'+taskid+'/reply')
        .send({textreply: 'Test Reply from test' + timestamp2,
    
            })
        // .expect('Location', '/tasks')
        // .expect('Content-Type', /json/)
        .expect('Location', '/users/login')
        // .expect(res =>{
        //     console.log(res.text)
        //     assert.ok(res.text.includes('true'))
        //     assert.ok(res.text.includes('success'))
        // })
        .end(done)
    })
})

describe('/tasks/t/openreply GET works', function(){
   
    it('Should return first reply to task', function(done){

        Reply.findOne({active: true, replytotask: taskid}).sort({timestamp:1}).lean().exec()
        .then(result => {
            // var newres = JSON.parse(result);
            // console.log(result)
            // newres._id = JSON.stringify(result._id)
            // newres.timestamp = JSON.stringify(result.timestamp)
            // console.log(result.toJSON())
            
            agent
            .get('/tasks/t/'+taskid+'/openreply')
            .expect('Content-Type', /json/)
            .expect(res => {
                assert.deepStrictEqual(res.body._id, result._id.str)
            })

            .end(done)
        })
        .catch(err => {
            console.log(err)
        })
    })
})

describe('/tasks/t/openreply GET unauthorized user', function(){
    it('Should return cannot open error', function(done){
        agent2
        .get('/tasks/t/'+taskid+'/openreply')
        .expect(res => {
            assert.ok(res.text.includes("Can't open another user's Task's replies"))
        })

        .end(done)
    })
})

describe('/tasks/t/openreply logged out', function(){
    it('Should return cannot open error', function(done){
        request(app)
        .get('/tasks/t/'+taskid+'/openreply')
        .expect('Location', '/users/login')

        .end(done)
    })
})

describe('/tasks/t/nextreply works there is another reply', function(){
    it('Should return next reply', function(done){

        Reply.find({active:true, replytotask: taskid}).sort({timestamp:1}).lean().exec()
        .then(result => {


            agent
            .get('/tasks/t/'+taskid+'/nextreply')
            .expect(res => {
                // console.log(res.body)
                // console.log(result[1]._id)

                assert.deepStrictEqual(res.body.replies._id, result[1]._id.toString())
            })
            .end(done)


        })
        
    })
})

describe('/tasks/t/nextreply works no next reply', function(){
    it('Should return next reply', function(done){

        Reply.find({active:true, replytotask: taskid}).sort({timestamp:1}).lean().exec()
        .then(result => {


            agent
            .get('/tasks/t/'+taskid+'/nextreply')
            .expect(res => {
                // console.log(res.body)
                // console.log(result[1]._id)

                assert.deepStrictEqual(res.body.replies, null)
            })
            .end(done)


        })
        
    })
})


describe('/tasks/t/nextreply unauthorized user', function(){
    it('Should return cannot access error', function(done){
        agent2
        .get('/tasks/t/'+taskid+'/nextreply')
        .expect(res => {
            // console.log("res.text here ___________________________")
            // console.log(res.text)
            assert.ok(res.text.includes("Can't access another user's Task's replies"))
        })

        .end(done)
    })
})

describe('/tasks/t/nextreply logged out', function(){
    it('Should redirect to login page', function(done){
        request(app)
        .get('/tasks/t/'+taskid+'/nextreply')
        .expect('Location', '/users/login')

        .end(done)
    })
})

describe('/tasks/t/reply POST 3', function(){
    it('Should return a success json object', function(done){
        agent2
        .post('/tasks/t/'+taskid+'/reply')
        .send({textreply: 'Test Reply 3 from test' + timestamp2,
    
            })
        // .expect('Location', '/tasks')
        .expect('Content-Type', /json/)
        .expect({success: true})

        .end(done)
    })
})
describe('/tasks/t/choosereply unauthorized user', function(){
    it('Should return cannot access error', function(done){


        agent2
        .get('/tasks/t/'+taskid+'/nextreply')
        .expect(res => {
            console.log("res.text here ___________________________")
            console.log(res.text)
        
            assert.ok(res.text.includes('Can\'t access another user\'s Task\'s replies'))
        })
        .end(done)
    })
})


describe('/tasks/t/choosereply logged out', function(){
    it('Should redirect to login page', function(done){
        request(app)
        .get('/tasks/t/'+taskid+'/nextreply')
        .expect('Location', '/users/login')

        .end(done)
    })
})




describe('/tasks/t/choosereply works', function(){
    it('Should return done:true', function(done){


        agent
        .get('/tasks/t/'+taskid+'/choosereply')
        .expect('Content-Type', /json/)
        .expect({done: true})
        .end(done)
    
        
    })
})

describe('/tasks/t/choosereply works and reply is chosen', function(){
    it('Should return chosen reply', function(done){

        Reply.find({chosen: true, replytotask: taskid}).sort({timestamp:1}).exec()
        .then(result => {
            // console.log(result)
            assert.deepStrictEqual(result.length, 1)
            assert.deepStrictEqual(result[0].chosen, true);

            done();

            
        })
        
    })
})








})








