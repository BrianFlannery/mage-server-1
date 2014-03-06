module.exports = function(app, security) {
  var Icon = require('../models/icon')
    , access = require('../access');

  var p***REMOVED***port = security.authentication.p***REMOVED***port
    , authenticationStrategy = security.authentication.authenticationStrategy;

  app.all('/api/icons*', p***REMOVED***port.authenticate(authenticationStrategy));

  // TODO when we switch to events we need to change all the *_LAYER roles
  // to *_EVENT roles

  // get all icons
  app.get(
    '/api/icons', 
    access.authorize('READ_LAYER'),
    function (req, res) {
      Icon.getAll(function (err, icons) {
        res.json(icons);
      });
    }
  );

  // get icon
  app.get(
    '/api/icons/:id', 
    access.authorize('READ_LAYER'),
    function(req, res, next) {
      new api.Icon().getById(req.param('id'), function(err, icon) {
        if (err) return next(err);

        if (!icon) return res.send(404);

        var stream = fs.createReadStream(icon.path);
        stream.on('open', function() {
          res.type(icon.contentType);
          res.attachment(icon.name);
          res.header('Content-Length', icon.size);
          stream.pipe(res);
        });
        stream.on('error', function(err) {
          console.log('error', err);
          res.send(404);
        });
      });
    }
  );

  // Create a new icon
  app.post(
    '/api/icons',
    access.authorize('CREATE_LAYER'),
    function(req, res, next) {
      new api.Icon().create(req.files.icon, function(err, icon) {
        if (err) return next(err);

        return res.json(icon);
      });
    }
  );

  // Delete an icon
  app.delete(
    '/api/icons/:iconId',
    access.authorize('DELETE_LAYER'),
    function(req, res) {
      new api.Icon().delete(req.icon, function(err, icon) {
        if (err) return next(err);

        return res.json(icon);
      });
    }
  );
}