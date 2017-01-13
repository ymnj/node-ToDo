const expect = require('expect');
const request = require('supertest');

const app = require('../server/app');
const Todo = require('../app/models/todoModel');

const todos = [
  {
    title: 'Study Code',
    description: 'Node and React',
    completedAt: 12
  },
  {
    title: 'Play games',
    description: 'Overwatch'
  },
  {
    title: 'Cook',
    description: 'Friend chicken',
    completedAt: 2
  },
  {
    title: 'Work out',
    description: 'Go to the gym',
    completedAt: 12
  }];

//Run before each test case to setup our data environment
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => {
    done()
  })
});

describe('/todos', () => {

  describe('GET todos', () => {

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
  }) //End GET

  describe('POST todos', () => {

    it('should create one new todo', (done) => {
      var testTodo = {
        title: "Test todo post",
        description: "Post a valid todo"
      };

      request(app)
        .post('/todos')
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
        .post('/todos')
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

}); //END TODO describe










