// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next){
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

//Get/login -- formulario de login
exports.new = function(req, res) {
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

// Post /login -- crear la sesión
exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    if (error) {
      req.session.errors = [{"message": 'Se ha producido un error: '+error}];
      res.redirect("/login");
      return;
    }

    //Crear sesion.user y guardar campos id y username
    //la sesión se define por la existencia de req.session.user
    req.session.user = {id:user.id, username:user.username};

    res.redirect(req.session.redir.toString());
  });
};

//DELETE /logout -- destruir sesion
exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString());
};
