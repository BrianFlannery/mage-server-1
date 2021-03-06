var sinon = require('sinon')
  , mongoose = require('mongoose')
  , TokenModel = mongoose.model('Token');

require('sinon-mongoose');

describe("location tests", function() {

  var sandbox;
  before(function() {
    sandbox = sinon.sandbox.create();
  });

  beforeEach(function() {
    var token = {
      _id: '1',
      token: '12345',
      userId: {
        populate: function(field, callback) {
          callback(null, {
            _id: '1',
            username: 'test',
            roleId: {
              permissions: ['READ_USER']
            }
          });
        }
      }
    };

    sandbox.mock(TokenModel)
      .expects('findOne')
      .withArgs({token: "12345"})
      .chain('populate', 'userId')
      .chain('exec')
      .yields(null, token);
  });

  afterEach(function() {
    sandbox.restore();
  });

  xit("should create locations for an event", function(done) {

  });

  xit("should create a location for an event", function(done) {

  });

  xit("should reject new location w/o geometry", function(done) {

  });

  xit("should reject new location w/o properties", function(done) {

  });

  xit("should reject new location w/o timestamp", function(done) {

  });

  xit("should get locations", function(done) {

  });

  xit("should get locations grouped by user", function(done) {

  });


});
