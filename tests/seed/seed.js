const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const Todo = require('../../app/models/todoModel');
const User = require('../../app/models/userModel');

const testUserOne = new ObjectID();
const testUserTwo = new ObjectID();
const testUserThree = new ObjectID();

const usersSeed = [
  {
    _id: testUserOne,
    userName: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    password: 'testPass',
    email: 'test@test.ca',
    tokens: [{
      access: "auth",
      token: jwt.sign({_id: testUserOne, access: 'auth'}, 'testsecret').toString()
    }]
  },
  {
    _id: testUserTwo,
    userName: 'secondUser',
    firstName: 'Second',
    lastName: 'Tester',
    password: 'testPass',
    email: 'testTwo@test.ca',
    tokens: [{
      access: "auth",
      token: jwt.sign({_id: testUserTwo, access: 'auth'}, 'testsecret').toString()
    }] 
  },
  {
    _id: testUserThree,
    userName: 'seedUser',
    firstName: 'Seed',
    lastName: 'User',
    password: 'testPass',
    email: 'testSeed@test.ca' 
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(usersSeed[0]).save();
    let userTwo = new User(usersSeed[1]).save();
    let userThree = new User(usersSeed[2]).save();

    return Promise.all([userOne, userTwo, userThree]).then(() => {

    })
  }).then(() => {
    done();
  })
}

const todosSeed = [
  {
    _id: new ObjectID(),
    title: 'Study Code',
    description: 'Node and React'
  },
  {
    _id: new ObjectID(),
    title: 'Play games',
    description: 'Overwatch',
    completedAt: 2,
    isDone: true
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
  }
];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todosSeed);
  }).then(() => {
    done()
  })
};

module.exports = { usersSeed, populateUsers, todosSeed, populateTodos}




