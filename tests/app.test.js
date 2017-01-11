const expect = require('expect');
const request = require('supertest');

const app = require('../server/app');
const Todo = require('../app/models/todoModel');


//Run before each test case to setup our data environment
beforeEach((done) => {
  Todo.remove({}).then(() => {
    done();
  })
});


describe('POST /todos', () => {

  it('should create one new todo', (done) => {
    var title = 'Trade';

    request(app)
      .post('/todos')
      .send({
        title
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].title).toBe(title);
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
          expect(todos.length).toBe(0)
          done();
        }).catch((err) => {
          done(err);
        })
      })
  })


});