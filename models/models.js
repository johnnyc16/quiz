var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

//Cargar modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importr definición de la tabla comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // exportar tabla Quiz
exports.Comment = Comment;

//sequelize.sync() cewa e inicializa la tabla de preguntas en db
sequelize.sync().then(function() {
  //then(..) ejecuta el manejador una vez creafa la tabla
  Quiz.count().then(function(count) {
    if (count === 0) { //la tabla se inicializzará solo si estta vacía
      Quiz.create({ pregunta: 'Capital de Italia',
                    respuesta: 'Roma',
                    tema: 'otro'
                  })
      Quiz.create({ pregunta: 'Capital de Portugal',
                    respuesta: 'Lisboa',
                    tema: 'otro'
                  })
      Quiz.create({ pregunta: 'La afición a coleccionar sellos',
                    respuesta: 'filatelia',
                    tema: 'ocio'
                  })
      Quiz.create({ pregunta: 'Nombre última version Android',
                    respuesta: 'lollipop',
                    tema: 'tecnologia'
                  })
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});
