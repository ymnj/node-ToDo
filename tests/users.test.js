const expect = require('expect');
const request = require('supertest');

const app = require('../server/app');
const User = require('../app/models/userModel');


//Run before each test case to setup our data environment
beforeEach((done) => {
  User.remove({}).then(() => {
    done();
  })
});

describe('/users', () => {

  describe('GET users', () => {

    it('should get an array of all users from database', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('object')
        })
        .end(done);
    })
  })// End GET

  describe('POST users', () => {

    it('should create a new user', (done) => {
    var userName = 'TestTest';

    request(app)
      .post('/users')
      .send({userName})
      .expect(200)
      .expect((res) => {
        expect(res.body.userName).toBe('TestTest')
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.find().then((users) => {
          expect(users.length).toBe(1);
          expect(users[0].userName).toBe(userName);
          done();
        }).catch((err) => {
          done(err)
        });
      })
    })
  })// End POST

}) // End describe



