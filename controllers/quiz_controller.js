var models = require('../models/models.js')

//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error) { next(error);});
};

//GET /quizes
exports.index = function(req, res) {
  if(req.query.search) {
    var buscar = (req.query.search || '').replace(" ", "%").toLowerCase();
    models.Quiz.findAll({where:["LOWER(pregunta) like ?", '%'+buscar+'%'],order:'pregunta ASC'}
      ).then(function (quizes){
        res.render('quizes/index', {quizes: quizes, errors: []});
      }).catch(function (error) { next(error);});
    } else {
      models.Quiz.findAll().then(function (quizes){
        res.render('quizes/index', {quizes: quizes, errors: []});
      }).catch(function (error) { next(error);});
    }
};

//GET /quizes/:id
exports.show = function (req, res) {
  res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/answer
exports.answer = function (req, res) {
  var resultado = 'Incorrecto';
    if (req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
      resultado = 'Correcto';
    }
    res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};
