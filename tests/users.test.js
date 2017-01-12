const expect = require('expect');
const request = require('supertest');

const app = require('../server/app');
const User = require('../app/models/userModel');


//Run before each test case to setup our data environment
// beforeEach((done) => {
//   User.remove({}).then(() => {
//     done();
//   })
// });


describe('/users', () => {

  describe('GET index', () => {

    it('should get an array of all users from database', (done) => {
      request(app)
        .get('/users')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body[0]).toInclude({
            userName: "TomMi"
          })
        })
        .end((err, res) => {
          if(err) throw error

          User.find().then((docs) => {
            console.log(docs.length)
          })
        });
    })






  })
  
})



