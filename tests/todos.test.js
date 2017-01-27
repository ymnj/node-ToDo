const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../server/app');
const Todo = require('../app/models/todoModel');
const {usersSeed, todosSeed, populateTodos} = require('./seed/seed');


//Run before each test case to setup our data environment
beforeEach(populateTodos);

describe('TODOS', () => {

  describe('GET /todos', () => {

    it('should retrieve all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('object')
          expect(res.body.todos.length).toBe(4)
        })
        .end(done);
    })

    it('should retrieve a single todo with a valid ID', (done) => {
      request(app)
        .get(`/todos/${todosSeed[0]._id.toHexString()}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('object')
          expect(res.body.todo.title).toBe(todosSeed[0].title)
        })
        .end(done);
    })

    it('should return a 404 if todo is not found with valid ID', (done) => {
      let randomId = new ObjectID().toHexString();

      request(app)
        .get(`/todos/${randomId}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/todos/fakeid123')
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should not return a todo not owned by user', (done) => {
      request(app)
        .get(`/todos/${todosSeed[2]._id.toHexString()}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(404)
        .end(done)
    })
  }); //End GET /users

  describe('GET /todos/user', () => {
      
    it('should return all the todos for a single user', (done) => {
      request(app)
      .get('/todos/user')
      .set('x-auth', usersSeed[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2)
      })
      .end(done)
    })
  })

  describe('POST /todo', () => {

  it('should create one new todo', (done) => {
    let testTodo = {
      title: "Test todo post",
      description: "Post a valid todo"
    };

    request(app)
      .post('/todo')
      .set('x-auth', usersSeed[0].tokens[0].token)
      .send(testTodo)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(testTodo.title)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({title: "Test todo post"}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].title).toBe(testTodo.title);
          done();
        }).catch((err) => {
          done(err);
        })
      });
  });

  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todo')
      .set('x-auth', usersSeed[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({}).then((todos) => {
          expect(todos.length).toBe(4)
          done();
        }).catch((err) => {
          done(err);
        })
      })
    })
  }); //End POST

  describe('PATCH /todos', () => {

    it('should update a todo with valid objectID and auth', (done) => {

      let updateId = todosSeed[0]._id.toHexString();
      let updatedParams = {
        title: "updatedTitle",
        description: "updatedDescription",
        hasAttachment: true,
        isDone: true
      }

      request(app)
        .patch(`/todo/${updateId}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .send(updatedParams)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.title).toBe(updatedParams.title)
          expect(res.body.todo.description).toBe(updatedParams.description)
          expect(res.body.todo.hasAttachment).toBe(updatedParams.hasAttachment)
          expect(res.body.todo.completedAt).toBeA('number')
        })
        .end(done)
    })

    it('should not update a todo with invalid auth', (done) => {
      let updateId = todosSeed[0]._id.toHexString();
      let updatedParams = {
        title: "updatedTitle",
        description: "updatedDescription",
        hasAttachment: true,
        isDone: true
      }

      request(app)
        .patch(`/todo/${updateId}`)
        .set('x-auth', usersSeed[1].tokens[0].token)
        .send(updatedParams)
        .expect(404)
        .end((err, res) => {
          if(err){
            return done(err);
          }

          Todo.findById(updateId).then((todo) => {
            expect(todo.title).toBe(todosSeed[0].title)
            done()
          }).catch((err) => {
            done(err)
          })
        })
    })

    it('should clear completedAt if isDone is false', (done) => {

      let updateId = todosSeed[1]._id.toHexString();
      let updatedParams = {
        isDone: false
      }

      request(app)
        .patch(`/todo/${updateId}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .send(updatedParams)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.isDone).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        }) 
        .end(done)
    })

    it('should return 404 with non valid ObjectID', (done) => {

      let updateId = new ObjectID().toHexString();

      request(app)
        .patch(`/todo/${updateId}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

    it('should return 404 with a non ObjectID', (done) => {

      request(app)
        .patch('/todo/fake123')
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(404)
        .end(done)
    })

  }) // End UPDATE


  describe('DELETE /todo/:id', () => {

    it('should delete a todo with valid objectID and auth', (done) => {

      let deleteID = todosSeed[0]._id.toHexString();

      request(app)
        .delete(`/todo/${deleteID}`)
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(deleteID);
        })
        .end((err, res) => {
          if(err){
            return done(err);
          }

          Todo.findById(deleteID).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

    it('should not delete a todo with bad auth', (done) => {

      let deleteID = todosSeed[0]._id.toHexString();

      request(app)
        .delete(`/todo/${deleteID}`)
        .set('x-auth', usersSeed[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
          if(err){
            return done(err);
          }

          Todo.findById(deleteID).then((todo) => {
            expect(todo).toExist();
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

    it('should return 404 with invalid objectID', (done) => {

      let deleteID = new ObjectID().toHexString();

      request(app)
        .delete(`/todo/${deleteID}`)
        .set('x-auth', usersSeed[1].tokens[0].token)
        .expect(404)
        .end((req, res) => {
          Todo.find().then((todos) => {
            expect(todos.length).toBe(todosSeed.length)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

    it('it should return 404 with non-object IDs', (done) => {

      request(app)
        .delete('/todo/fakeid123')
        .set('x-auth', usersSeed[1].tokens[0].token)
        .expect(404)
        .end((req, res) => {
          Todo.find().then((todos) => {
            expect(todos.length).toBe(todosSeed.length)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

  }) //End DELETE


});



