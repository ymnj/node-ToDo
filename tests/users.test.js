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
    password: 'testPass',
    email: 'test@test.ca'
  },
  {
    _id: new ObjectID(),
    userName: 'secondUser',
    firstName: 'Second',
    lastName: 'Tester',
    password: 'testPass',
    email: 'testTwo@test.ca' 
  },
  {
    _id: new ObjectID(),
    userName: 'seedUser',
    firstName: 'Seed',
    lastName: 'User',
    password: 'testPass',
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
  
    it('it should return a user with the valid ID', (done) => {
        request(app)
          .get(`/users/${testSeed[0]._id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeA('object')
            expect(res.body.user.userName).toBe(testSeed[0].userName)
          })
          .end(done)
      })

      it('should return 404 if user not found with valid ID', (done) => {
        request(app)
          .get(`/users/${new ObjectID()}`)
          .expect(404)
          .end(done)
      })

      it('should return 404 with non-object IDs', (done) => {
        request(app)
          .get(`/users/fakeid`)
          .expect(404)
          .end(done)
      })
  })


  describe('POST /user', () => {

    it('should create a new user with valid data', (done) => {
      var testUser = {
        userName: "tommi",
        firstName: "tom",
        lastName: "hung",
        password: "testPass",
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

    it('should not create a new user with invalid data', (done) => {
      request(app)
        .post('/user')
        .send({})
        .expect(400)
        .end((err, res) => {
          if(err){
            return done(err)
          }

          User.find().then((users) => {
            expect(users.length).toBe(3);
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

  })// End POST


  describe('PATCH /users', () => {

    it('should update a user with valid ObjectID', (done) => {

      let updateId = testSeed[2]._id.toHexString();
      let params = {
        userName: "testuserName",
        firstName: "firstTest",
        lastName: "lastTest",
        email: "updatetest@test.ca"
      }

      request(app)
        .patch(`/user/${updateId}`)
        .send(params)
        .expect(200)
        .expect((res) => {
          expect(res.body.user.userName).toBe(params.userName)
          expect(res.body.user.firstName).toBe(params.firstName)
          expect(res.body.user.lastName).toBe(params.lastName)
          expect(res.body.user.email).toBe(params.email)
        })
        .end(done)
    });

    it('should return a 404 with invalid ObjectId', (done) => {

      let = updateId = new ObjectID().toHexString();

      request(app)
        .patch(`/users/${updateId}`)
        .expect(404)
        .end(done)
    });

    it('should return a 400 with a non ObjectID', (done) => {

      request(app)
        .patch('/user/fake123')
        .expect(404)
        .end(done)
    });



  }) //End PATCH

  describe('DELETE /users', () => {

    it('should delete a user with a valid object ID', (done) => {

      let deleteID = testSeed[0]._id.toHexString();

      request(app)
        .delete(`/user/${deleteID}`)
        .expect(200)
        .end((req, res) => {
          User.find().then((users) => {
            expect(users.length).toBe(testSeed.length - 1);
            done();
          }).catch((err) => {
            done(err)
          })
        })
    })

    it('should return 404 with an invalid object ID', (done) => {

      let deleteID = new ObjectID().toHexString();

      request(app)
        .delete('/users/deleteID')
        .expect(404)
        .end((req, res) => {
          User.find().then((users) => {
            expect(users.length).toBe(testSeed.length)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

    it('should return 404 with non-object ID', () => {

      request(app)
        .delete('/users/fake123')
        .expect(404)
        .end((req, res) => {
          User.find().then((users) => {
            expect(users.length).toBe(testSeed.length)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

  }) //End DELETE

}) // End describe



