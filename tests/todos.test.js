const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../server/app');
const Todo = require('../app/models/todoModel');

const testSeed = [
  {
    _id: new ObjectID(),
    title: 'Study Code',
    description: 'Node and React',
    completedAt: 12
  },
  {
    _id: new ObjectID(),
    title: 'Play games',
    description: 'Overwatch'
  },
  {
    _id: new ObjectID(),
    title: 'Cook',
    description: 'Friend chicken',
    completedAt: 2
  },
  {
    _id: new ObjectID(),
    title: 'Work out',
    description: 'Go to the gym',
    completedAt: 12
  }];

//Run before each test case to setup our data environment
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(testSeed);
  }).then(() => {
    done()
  })
});

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
        .get(`/todos/${testSeed[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('object')
          expect(res.body.todo.title).toBe(testSeed[0].title)
        })
        .end(done);
    })

    it('should return a 404 if todo is not found with valid ID', (done) => {
      let randomId = new ObjectID().toHexString();

      request(app)
        .get(`/todos/${randomId}`)
        .expect(404)
        .end(done)
    })

    it('should return 404 for non-object ids', (done) => {
      request(app)
        .get('/todos/fakeid123')
        .expect(404)
        .end(done)
    })

  }); //End GET

  describe('POST /todo', () => {

  it('should create one new todo', (done) => {
    let testTodo = {
      title: "Test todo post",
      description: "Post a valid todo"
    };

    request(app)
      .post('/todo')
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

  describe('DELETE /todos', () => {

    it('should delete a todo with valid objectID', (done) => {

      let deleteID = testSeed[0]._id.toHexString();

      request(app)
        .delete(`/todos/${deleteID}`)
        .expect(200)
        .end((req, res) => {
          Todo.find({}).then((todos) => {
            expect(todos.length).toBe(testSeed.length - 1)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

    it('should return 404 with invalid objectID', (done) => {

      let deleteID = new ObjectID().toHexString();

      request(app)
        .delete(`/todos/${deleteID}`)
        .expect(404)
        .end(done)
    })

    it('it should return 404 with non-object IDs', (done) => {

      request(app)
        .delete('/todos/fakeid123')
        .expect(404)
        .end(done)
    })

  }) //End DELETE


});



