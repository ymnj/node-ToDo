const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../server/app');
const User = require('../app/models/userModel');


let testSeed = [
  {
    _id: new ObjectID(),
    userName: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@test.ca'
  },
  {
    _id: new ObjectID(),
    userName: 'secondUser',
    firstName: 'Second',
    lastName: 'Tester',
    email: 'testTwo@test.ca' 
  },
  {
    _id: new ObjectID(),
    userName: 'seedUser',
    firstName: 'Seed',
    lastName: 'User',
    email: 'testSeed@test.ca' 
  }
] 

//Run before each test case to setup our data environment
beforeEach((done) => {
  User.remove({}).then(() => {
    return User.insertMany(testSeed)
  }).then(() => {
    done();
  })
});

describe('USERS', () => {

  describe('GET /users', () => {

    it('should get an array of all users from database', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('object')
        })
        .end(done);
    })
  })

  describe('GET /user', () => {

      it('it should return a user with the valid ID', (done) => {
        request(app)
          .get(`/user/${testSeed[0]._id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeA('object')
            expect(res.body.user.userName).toBe(testSeed[0].userName)
          })
          .end(done)
      })

      it('should return 404 if user not found with valid ID', (done) => {
        request(app)
          .get(`/user/${new ObjectID()}`)
          .expect(404)
          .end(done)
      })

      it('should return 404 with non-object IDs', (done) => {
        request(app)
          .get(`/user/fakeid`)
          .expect(404)
          .end(done)
      })

    })

  describe('POST /user', () => {

    it('should create a new user', (done) => {
    var testUser = {
      userName: "tommi",
      firstName: "tom",
      lastName: "hung",
      email: "tom@test.ca"
    }

    request(app)
      .post('/user')
      .send(testUser)
      .expect(200)
      .expect((res) => {
        expect(res.body.userName).toBe(testUser.userName)
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.find().then((users) => {
          expect(users.length).toBe(4);
          expect(users[users.length - 1].userName).toBe(testUser.userName);
          done();
        }).catch((err) => {
          done(err)
        });
      })
    })
  })// End POST

}) // End describe



