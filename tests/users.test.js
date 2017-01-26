const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const app = require('../server/app');
const User = require('../app/models/userModel');
const { usersSeed, populateUsers } = require('./seed/seed');


//Run before each test case to setup our data environment
beforeEach(populateUsers);

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
          .get(`/users/${usersSeed[0]._id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toBeA('object')
            expect(res.body.user.userName).toBe(usersSeed[0].userName)
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

  describe('GET /test/me', () => {

    it('should return a user with valid auth', (done) => {
      request(app)
        .get('/test/me')
        .set('x-auth', usersSeed[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(usersSeed[0]._id.toHexString())
          expect(res.body.email).toBe(usersSeed[0].email)
        })
        .end(done)
    });

    it('should return 401 if invalid auth', (done) => {
      request(app)
        .get('/test/me')
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual({})
        })
        .end(done)
    });

  })


  describe('POST /user', () => {

    it('should create a new user with valid data', (done) => {
      let testUser = {
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
          expect(res.body.email).toBe(testUser.email)
          expect(res.body._id).toExist()
          expect(res.headers['x-auth']).toExist()
        })
        .end((err, res) => {
          if(err){
            return done(err)
          }

          User.find().then((users) => {
            expect(users.length).toBe(4);
            expect(users[users.length - 1].userName).toBe(testUser.userName);
            expect(users[users.length - 1].password).toNotBe(testUser.password)
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

    it('should not create a new user with a duplicate email', (done) => {

      let testUserWithSameEmail = {
        userName: "tommi",
        firstName: "tom",
        lastName: "hung",
        password: "testPass",
        email: "test@test.ca"
      }

      request(app)
        .post('/user')
        .send(testUserWithSameEmail)
        .expect(400)
        .end(done)
    })

  })// End POST


  describe('PATCH /users', () => {

    it('should update a user with valid ObjectID', (done) => {

      let updateId = usersSeed[2]._id.toHexString();
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

      let deleteID = usersSeed[0]._id.toHexString();

      request(app)
        .delete(`/user/${deleteID}`)
        .expect(200)
        .end((req, res) => {
          User.find().then((users) => {
            expect(users.length).toBe(usersSeed.length - 1);
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
            expect(users.length).toBe(usersSeed.length)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

    it('should return 404 with non-object ID', (done) => {

      request(app)
        .delete('/users/fake123')
        .expect(404)
        .end((req, res) => {
          User.find().then((users) => {
            expect(users.length).toBe(usersSeed.length)
            done();
          }).catch((err) => {
            done(err);
          })
        })
    })

  }) //End DELETE

}) // End describe



