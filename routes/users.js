module.exports = function(app, auth) {
  var User = require('../models/user')
    , Token = require('../models/token')
    , Role = require('../models/role')
    , Team = require('../models/team');

  var p***REMOVED***port = auth.p***REMOVED***port;
  var strategy = auth.strategy;

  var validateUserParams = function(req, res, next) {
    var invalidResponse = function(param) {
      return "Cannot create user, invalid parameters.  '" + param + "' parameter is required";
    }

    var username = req.param('username');
    if (!username) {
      res.send(400, invalidResponse('username'));
    }

    var firstname = req.param('firstname');
    if (!firstname) {
      res.send(400, invalidResponse('firstname'));
    }

    var lastname = req.param('lastname');
    if (!lastname) {
      res.send(400, invalidResponse('lastname'));
    }

    var email = req.param('email');
    if (!email) {
      res.send(400, invalidResponse('email'));
    }

    var p***REMOVED***word = req.param('p***REMOVED***word');
    if (!p***REMOVED***word) {
      res.send(400, invalidResponse('p***REMOVED***word'));
    }

    var p***REMOVED***wordconfirm = req.param('p***REMOVED***wordconfirm');
    if (!p***REMOVED***wordconfirm) {
      res.send(400, invalidResponse('p***REMOVED***wordconfirm'));
    }

    if (p***REMOVED***word != p***REMOVED***wordconfirm) {
      res.send(400, 'p***REMOVED***words do not match');
    }

    req.user = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      p***REMOVED***word: p***REMOVED***word
    }

    next();
  }

  var validateRoleParams = function(req, res, next) {
      var roles = req.param('roles');
      if (!roles) {
        return res.send(400, "Cannot set roles, 'roles' param not specified");
      }

      var roles = roles.split(",");
      var validatedRoles = [];
      var validRoles = Role.getRoles();
      roles.forEach(function(role) {
        if (validRoles.indexOf(role) == -1) {
          return res.send(400, "Role '" + role + "' is not a valid role");
        }

        validatedRoles.push(role);
      });

      req.roles = validatedRoles;
      next();
  }

  var validateTeamParams = function(req, res, next) {
    var teamIds = req.param('teamIds');
    if (!teamIds) {
      return res.send(400, "Cannot set teams, 'teamIds' param not specified");
    }

    var teamIds = teamIds.split(",");
    var validatedTeams = [];
    Team.getTeams(function (err, validTeams) {
      teamIds.forEach(function(teamId) {
        var found = validTeams.some(function(validTeam) {
          return (teamId === validTeam._id.toString());
        });


        if (!found) {
          return res.send(400, "Team '" + teamId + "' is not a valid team id");
        }

        validatedTeams.push(teamId);
      });

      req.teamIds = validatedTeams;
      next();
    });
  }

  // login
  app.post(
    '/api/login',
    p***REMOVED***port.authenticate(strategy),
    function(req, res) {
      Token.createTokenForUser(req.user, function(err, token) {
        if (err) {
          return res.send("Error generating token", 400);
        }

        res.json({token: token.token});
      });
    }
  );

  // get all uses
  app.get(
    '/api/users', 
    p***REMOVED***port.authenticate('bearer'), 
      function (req, res) {
      User.getUsers(function (users) {
        res.json(users);
      });
  });

  // get user by id
  app.get( 
    '/api/users/:userId',
    p***REMOVED***port.authenticate('bearer'),
    function(req, res) {
     res.json(req.user);
    }
  );

  // Create a new user
  app.post(
    '/api/users',
    validateUserParams, 
    function(req, res) {
      User.createUser(req.user, function(err, newUser) {
        if (err) {
          return res.send(400, err);
        }

        res.json(newUser);
      });
    }
  );

  // Update a user
  app.put(
    '/api/users/:userId', 
    p***REMOVED***port.authenticate('bearer'),
    validateUserParams, 
    function(req, res) {
      User.updateUser(req.user, function(err, updatedUser) {
        if (err) {
          return res.send(400, err);
        }

        res.json(updatedUser);
      });
    }
  );

  // Delete a user
  app.delete(
    '/api/users/:userId', 
    p***REMOVED***port.authenticate('bearer'),
    function(req, res) {
      User.deleteUser(req.user, function(err, updatedUser) {
        if (err) {
          return res.send(400, err);
        }

        res.json(updatedUser);
      });
    }
  );

  // set roles for user
  app.post(
    '/api/users/:userId/roles',
    p***REMOVED***port.authenticate('bearer'),
    validateRoleParams,
    function(req, res) {
      User.setRolesForUser(req.user, req.roles, function(err, user) {
        res.json(user);
      });
    }
  );

  // remove all roles from user
  app.delete(
    '/api/users/:userId/roles',
    p***REMOVED***port.authenticate('bearer'),
    function(req, res) {
      User.removeRolesForUser(req.user, function(err, user) {
        res.json(user);
      })
    }
  );

  // set teams for users
  app.post(
    '/api/users/:userId/teams',
    p***REMOVED***port.authenticate('bearer'),
    validateTeamParams,
    function(req, res) {
      User.setTeamsForUser(req.user, req.teamIds, function(err, user) {
        res.json(user);
      });
    }
  );

  // remove all teams from user
  app.delete(
    '/api/users/:userId/teams',
    p***REMOVED***port.authenticate('bearer'),
    function(req, res) {
      User.removeTeamsForUser(req.user, function(err, user) {
        res.json(user);
      })
    }
  );
}