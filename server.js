let express = require('express')
let bodyParser = require('body-parser');
let app = express()
let port = 3000
let mysql = require('mysql');
let session = require('express-session');

// Configurar o middleware de sessão
app.use(session({
    secret: 'ea9af2f2c8e1e43703665f26d52309f8801ab8c9357a5e5c5d5d5f6c5f5a1951',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: false
}))
// parse application/json
app.use(bodyParser.json())

// Configurações do Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

/*LIGAÇÃO À BASE DE DADOS*/
let connection = mysql.createConnection({
    host: "localhost",
    user: "adminCACB",
    password: "adminCACB",
    database: "cacb",
});

connection.connect(function(err) {
    if (err) throw err;

    console.log("Database Connected!");

});

/*CRIAR CONTA e BCRYPT*/

let bcrypt = require('bcrypt');
let saltRounds = 10;

app.get('/criar-conta', (req, res) => {
    res.render('criar-conta', {
        message: null,
        formData: {}
    });
});

app.post('/criar-conta', (req, res) => {
    let {
      nome_utilizador,
      email,
      organizacao,
      palavra_passe,
      confirm_password,
      newsletter,
      news,
      events,
      education,
      blog,
      testimonials,
      "clinical-trials": clinicalTrials
    } = req.body;
    let newsletterChecked = newsletter === 'on' ? 1 : 0;
    let newsChecked = news === 'on' ? 1 : 0;
    let eventsChecked = events === 'on' ? 1 : 0;
    let educationChecked = education === 'on' ? 1 : 0;
    let blogChecked = blog === 'on' ? 1 : 0;
    let testimonialsChecked = testimonials === 'on' ? 1 : 0;
    let clinicalTrialsChecked = clinicalTrials === 'on' ? 1 : 0;
  
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(palavra_passe, salt, function(err, hash) {
        let sql = "SELECT * FROM utilizador WHERE nome_utilizador=?";
        connection.query(sql, [nome_utilizador], (err, result) => {
          if (err) throw err;
  
          if (result.length > 0) {
            let message = {
              error: 'Já existe uma conta associada ao nome de utilizador inserido.'
            }
            res.render('criar-conta', {
              message: message.error,
              formData: req.body
            });
            return;
          } else {
            let sql = "SELECT * FROM utilizador WHERE email=?";
            connection.query(sql, [email], (err, result) => {
              if (err) throw err;
  
              if (result.length > 0) {
                let message = {
                  error: 'Já existe uma conta associada ao email inserido.'
                }
                res.render('criar-conta', {
                  message: message.error,
                  formData: req.body
                });
                return;
              } else {
                if (palavra_passe !== confirm_password) {
                  let message = {
                    error: 'As palavras-passe não coincidem.'
                  }
                  res.render('criar-conta', {
                    message: message.error,
                    formData: req.body
                  });
                  return;
                } else {
                  connection.query('INSERT INTO utilizador (nome_utilizador, email, organizacao, palavra_passe) VALUES (?, ?, ?, ?)', [nome_utilizador, email, organizacao, hash], (err, results) => {
                    if (err) {
                      console.error('Erro ao inserir os dados na base de dados:', err);
                      res.status(500).send({
                        "message": "Erro ao criar a conta"
                      });
                      return;
                    }
  
                    let userId = results.insertId;
  
                    connection.query('INSERT INTO privilegio (idp, newsletter_p, noticia_p, evento_p, formacao_p, blog_p, testemunho_p, ensaio_clinico_p, fkp_idu) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, newsletterChecked, newsChecked, eventsChecked, educationChecked, blogChecked, testimonialsChecked, clinicalTrialsChecked, userId], (err, privilegeResult) => {
                      if (err) {
                        console.error('Erro ao inserir as informações de privilégio na base de dados:', err);
                        res.status(500).send({
                          "message": "Erro ao criar a conta"
                        });
                        return;
                      }
  
                      console.log('Conta criada com sucesso!');
                      let message_sucesso = 'Conta criada com sucesso! Tem de esperar que o administrador aceite para poder efetuar login.';
                      res.render('criar-conta', {
                        message: null, 
                        message_sucesso: message_sucesso,
                        formData: {}
                      });
                    });
                  });
                }
              }
            });
          }
        });
      });
    });
  });
  

/*LOGIN*/
// Rota GET para a página de login
app.get('/login', (req, res) => {
    res.render('login', {
        message: null
    });
});

app.post('/login', (req, res) => {
  let nome_utilizador = req.body.username;
  let palavra_passe = req.body.password;

  let sql = "SELECT * FROM utilizador WHERE nome_utilizador=?";
  connection.query(sql, [nome_utilizador], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      let utilizador = result[0];

      if (utilizador.aceite == 1) {
        bcrypt.compare(palavra_passe, utilizador.palavra_passe, (err, passwordMatch) => {
          if (err) throw err;

          if (passwordMatch) {
            req.session.userID = utilizador.idu;
            req.session.userName = utilizador.nome_utilizador;

            let privilegeQuery = "SELECT super_admin, newsletter_p, noticia_p, evento_p, formacao_p, blog_p, testemunho_p, ensaio_clinico_p FROM privilegio WHERE fkp_idu=?";
            connection.query(privilegeQuery, [utilizador.idu], (err, privilegeResult) => {
              if (err) throw err;

              if (privilegeResult.length > 0) {
                let userPrivileges = privilegeResult[0];

                let privileges = {
                  super_admin: userPrivileges.super_admin,
                  newsletter: userPrivileges.newsletter_p,
                  noticia: userPrivileges.noticia_p,
                  evento: userPrivileges.evento_p,
                  formacao: userPrivileges.formacao_p,
                  blog: userPrivileges.blog_p,
                  testemunho: userPrivileges.testemunho_p,
                  ensaio_clinico: userPrivileges.ensaio_clinico_p
                };
                
                req.session.userPriv = privileges;

                res.render('pagina_pessoal', {
                  id_utilizador: req.session.userID,
                  nome_utilizador: req.session.userName,
                  priv_utilizador: privileges,
                  message: null
                });
              } else {
                res.render('pagina_pessoal', {
                  id_utilizador: req.session.userID,
                  nome_utilizador: req.session.userName,
                  priv_utilizador: null,
                  message: null
                });
              }
            });
          } else {
            let message = {
              error: 'Password errada'
            };
            res.render('login', {
              message: message.error
            });
          }
        });
      } else {
        let message = {
          error: 'Não tem autorização para aceder à aplicação'
        };
        res.render('login', {
          message: message.error
        });
      }
    } else {
      let message = {
        error: 'Utilizador não encontrado'
      };
      res.render('login', {
        message: message.error
      });
    }
  });
});

  

//EDITAR PERFIL
app.get('/editar_perfil', (req, res) => {
    res.render('editar_perfil', {
        message: null
    });
});

// ROTA PARA ALTERAR EMAIL
app.post('/alterar_email', (req, res) => {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }
  let { newEmail } = req.body;
  let userId = req.session.userID; 

  connection.query('SELECT idu FROM utilizador WHERE email = ? AND idu <> ?', [newEmail, userId], (error, results) => {
      if (error) {
          return res.render('editar_perfil', {
              message: 'Ocorreu um erro ao verificar o email. Por favor, tente novamente.'
          });
      }

      if (results.length > 0) {
          return res.render('editar_perfil', {
              message: 'O email já está a ser usado por outro utilizador. Escolha um email diferente.'
          });
      }

      connection.query('UPDATE utilizador SET email = ? WHERE idu = ?', [newEmail, userId], (error, results) => {
          if (error) {
              return res.render('editar_perfil', {
                  message: 'Ocorreu um erro ao atualizar o email. Por favor, tente novamente.'
              });
          }
          console.log(newEmail)

          res.render('pagina_pessoal', {
              id_utilizador: req.session.userID,
              priv_utilizador: req.session.userPriv,
              nome_utilizador: req.session.userName,
              message: null
          });
      });
  });
});

app.post('/alterar_palavra_passe', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  let { newPassword, confirmPassword } = req.body;
  let userId = req.session.userID;

  if (newPassword !== confirmPassword) {
    return res.render('editar_perfil', {
      message: 'A nova palavra-passe e a confirmação não coincidem. Por favor, tente novamente.'
    });
  }

  bcrypt.hash(newPassword, 10, (error, hashedNewPassword) => {
    if (error) {
      return res.render('editar_perfil', {
        message: 'Ocorreu um erro ao gerar o hash da nova palavra-passe. Por favor, tente novamente.'
      });
    }

    connection.query('UPDATE utilizador SET palavra_passe = ? WHERE idu = ?', [hashedNewPassword, userId], (error, results) => {
      if (error) {
        return res.render('editar_perfil', {
          message: 'Ocorreu um erro ao atualizar a palavra-passe. Por favor, tente novamente.'
        });
      }

      res.render('pagina_pessoal', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
      });
    });
  });
});

//ROTA PARA A HOME PAGE
app.get('/home_page', (req, res) => {
  let blogQuery = 'SELECT titulo, texto, autor, data_publicacao FROM post_blog ORDER BY idb DESC LIMIT 3';
  let testemunhosQuery = 'SELECT * FROM testemunho ORDER BY idt DESC LIMIT 3';
  connection.query(blogQuery, (blogError, blogResults) => {
    if (blogError) {
      console.error('Erro ao encontrar posts do blog:', blogError);
      res.render('home_page', { message: 'Erro ao encontrar posts do blog' });
    } else {
      connection.query(testemunhosQuery, (testemunhosError, testemunhosResults) => {
        if (testemunhosError) {
          console.error('Erro ao encontrar testemunhos:', testemunhosError);
          res.render('home_page', { message: 'Erro ao encontrar testemunhos' });
        } else {
          res.render('home_page', { blogs: blogResults, testemunhos: testemunhosResults });
        }
      });
    }
  });
});

//ROTA PARA A PÁGINA PESSOAL
app.get('/pagina_pessoal', (req, res) => {

    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }
    let userId = req.query.id_utilizador;
    connection.query('SELECT * FROM utilizador WHERE idu = ?', [userId], (error, results) => {
        if (error) throw error;
        let utilizador = results[0];
        res.locals.utilizador = utilizador;
        res.render('pagina_pessoal');
    });
});

//ROTA QUANDO SE CANCELA O FORMULÁRIO
app.get('/cancelar', (req, res) => {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }
  res.render('pagina_pessoal', {
      id_utilizador: req.session.userID,
      priv_utilizador: req.session.userPriv,
      nome_utilizador: req.session.userName,
      message: null
  });
});

//----------CRIAR E EDITAR TESTEMUNHOS------------------------------------------------
app.get('/testemunho', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }


    res.render('criar_testemunho', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

app.get('/novo_testemunho', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    res.render('novo_testemunho')
});

app.post('/novo_testemunho', (req, res) => {
    let nome_testemunho = req.body.nome_testemunho;
    let opiniao = req.body.opiniao;
    let local_trabalho = req.body.local_trabalho
    let funcao = req.body.funcao;



    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    let id_utilizador = req.session.userID;

    let novoTestemunho = {
        nome_testemunho: nome_testemunho,
        opiniao: opiniao,
        local_trabalho: local_trabalho,
        funcao: funcao,
        fkt_idu: id_utilizador
    };

    connection.query('INSERT INTO testemunho SET ?', novoTestemunho, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos com sucesso.');
        res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
        });
    });

});

//ROTA PARA A PÁGINA DE TESTEMUNHOS
app.get('/testemunhos', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;

    connection.query('SELECT * FROM testemunho ORDER BY idt DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
        if (err) throw err;

        connection.query('SELECT COUNT(*) AS count FROM testemunho', function(err, countRows) {
            if (err) throw err;
            let totalCount = countRows[0].count;
            let totalPages = Math.ceil(totalCount / perPage);


            res.render('testemunhos_fe', {
                testemunhos: rows,
                currentPage: page,
                totalPages: totalPages
              }, function(err, html) {
                if (err) throw err;
                res.send(html);
              });
        });
    });
});

//ROTA PARA VER OS FORMS DOS TESTEMUNHOS CRIADOS
app.get('/ver_testemunhos', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT * FROM testemunho WHERE fkt_idu = ? ORDER BY idt DESC', [userID], function(err, rows) {
    if (err) throw err;
    res.render('ver_testemunhos', {
      testemunhos: rows
    });
  });
});

//ROTA PARA EDITAR OS FORMS DOS TESTEMUNHOS CRIADOS
app.get('/editar_testemunhos', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let testemunhoID = req.query.id;

  connection.query('SELECT * FROM testemunho WHERE idt = ?', [testemunhoID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_testemunhos', {
              testemunhos: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID do testemunho especificado: ' + testemunhoID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});


app.post('/editar_testemunhos', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let testemunhoID = req.body.testemunhoID; 
  let { nome_testemunho, opiniao, local_trabalho, funcao } = req.body;
  
  connection.query(
    'UPDATE testemunho SET nome_testemunho = ?, opiniao = ?, local_trabalho = ?, funcao = ? WHERE idt = ?',
    [nome_testemunho, opiniao, local_trabalho, funcao, testemunhoID],
    function(err, result) {
      if (err) {
        console.error('Erro ao atualizar o testemunho:', err);
        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        }); 
        return;
      }
      
      if (result.affectedRows > 0) {
        console.log('Testemunho atualizado com sucesso!');
      } else {
        console.log('Nenhum registoo encontrado para o ID do testemunho especificado: ' + testemunhoID);
      }
      
      res.render('pagina_pessoal', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
      });
    }
  );
  
});

// ROTA PARA APAGAR
app.get('/apagar_testemunho', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});

app.post('/apagar_testemunho', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let testemunhoID = req.body.testemunhoID;

  let sql = `DELETE FROM testemunho WHERE idt = ${testemunhoID}`;

  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Testemunho apagado');
    res.redirect('back');
  });
});
//------------------------------------------------------------------------------------------------------------------------------------------
// ------------------- CRIAR E EDITAR BLOG ----------------------------------------------------------------------------------------------------
app.get('/novo_blog', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }
    res.render('novo_blog')
});


app.get('/post_blog', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }
    res.render('criar_blog', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

let multer = require('multer');
let path = require('path');

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
      let uploadPath = 'public/images';
  
      let ext = path.extname(file.originalname).toLowerCase();
      if (ext === '.pdf') {
        uploadPath = 'public/docs'; 
      }
  
      cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
      let ext = path.extname(file.originalname);
      let nomeArquivo = Date.now() + ext;
      cb(null, nomeArquivo);
    }
  });
let upload = multer({
    storage: storage
});

app.post('/novo_blog', upload.single('imagem'), function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    let titulo = req.body.titulo_blog;
    let texto = req.body.texto_blog;
    let autor = req.body.autor_blog;
    let data_publicacao = new Date().toLocaleDateString('pt-PT');
    let tag1 = req.body.tag1;
    let tag2 = req.body.tag2;
    let tag3 = req.body.tag3;
    let imagem = req.body.imagem;
    let id_utilizador = req.session.userID;

    let partesData = data_publicacao.split('/');
    let data_formatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
    
    let novoBlog = {
        titulo: titulo,
        texto: texto,
        autor: autor,
        data_publicacao: data_formatada,
        tag1: tag1,
        tag2: tag2,
        tag3: tag3,
        imagem: imagem,
        fkb_idu: id_utilizador
    };

    

    if (req.file) {
        novoBlog.imagem = req.file.path.replace(/public\\/, '');
    }

    connection.query('INSERT INTO post_blog SET ?', novoBlog, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos com sucesso.');
        res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
        });
    });
});

//ROTA PARA A PÁGINA DOS POSTS DE BLOG
app.get('/blog', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;

    connection.query('SELECT * FROM post_blog ORDER BY idb DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
        if (err) throw err;
        

        connection.query('SELECT COUNT(*) AS count FROM post_blog', function(err, countRows) {
            if (err) throw err;
            let totalCount = countRows[0].count;
            let totalPages = Math.ceil(totalCount / perPage);


            res.render('blog', {
                blogs: rows,
                currentPage: page,
                totalPages: totalPages
              }, function(err, html) {
                if (err) throw err;
                res.send(html);
              });
        });
    });
});

app.get('/images/:filename', function(req, res) {
    let filename = req.params.filename;
    
    res.sendFile(filename, { root: __dirname + '/images' });
  });

//ROTA PARA VER OS FORMS DOS TESTEMUNHOS CRIADOS
app.get('/ver_blogs', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT * FROM post_blog WHERE fkb_idu = ? ORDER BY idb DESC', [userID], function(err, rows) {
    if (err) throw err;
    res.render('ver_blogs', {
      blogs: rows
    });
  });
});

//ROTA PARA EDITAR OS FORMS DOS BLOGS CRIADOS
app.get('/editar_blogs', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let blogID = req.query.id;

  connection.query('SELECT * FROM post_blog WHERE idb = ?', [blogID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_blogs', {
              blogs: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID do blog especificado: ' + blogID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});


app.post('/editar_blogs', upload.single('imagem'), function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  let blogID = req.body.blogID;
  let { titulo_blog, texto_blog, autor_blog, tag1, tag2, tag3 } = req.body;

  let updateFields = {};

  if (titulo_blog !== "") {
    updateFields.titulo = titulo_blog;
  }

  if (texto_blog !== "") {
    updateFields.texto = texto_blog;
  }

  if (autor_blog !== "") {
    updateFields.autor = autor_blog;
  }

  

  if (tag1 !== "") {
    updateFields.tag1 = tag1;
  }

  if (tag2 !== "") {
    updateFields.tag2 = tag2;
  }

  if (tag3 !== "") {
    updateFields.tag3 = tag3;
  }

  if (req.file) {
    updateFields.imagem = req.file.path.replace(/public\\/, '');
  }

  

  if (Object.keys(updateFields).length > 0) {
    connection.query(
      'UPDATE post_blog SET ? WHERE idb = ?',
      [updateFields, blogID],
      function (err, result) {
        if (err) {
          console.error('Erro ao atualizar o blog:', err);
        } else {
          if (result.affectedRows > 0) {
            console.log('Evento atualizado com sucesso!');
          } else {
            console.log('Nenhum registo encontrado para o ID do blog especificado 2');
          }
        }

        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        });
      }
    );
  }
});

//APAGAR UM POST DE BLOG
app.get('/apagar_blog', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/apagar_blog', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let blogID = req.body.blogID;

  let sql = `DELETE FROM post_blog WHERE idb = ${blogID}`;

  // Executar a query
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Post de blog apagado');
    res.redirect('back');
  });
});
//------------------------------------------------------------------------------------------------------------------
//---------------- CRIAR E EDITAR ENSAIOS CLÍNICOS -----------------------------------------------------------------
app.get('/criar_ensaio', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }


    res.render('criar_ensaio', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

app.get('/novo_ensaio', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    res.render('novo_ensaio')
});

app.post('/novo_ensaio', (req, res) => {
    console.log('2' + req.body.nome_ensaio)
    let nome_ensaio = req.body.nome_ensaio;
    let patologia = req.body.patologia;
    let texto_ensaio = req.body.texto_ensaio
    let estado = req.body.estado;



    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    let id_utilizador = req.session.userID;

    let novoEnsaio = {
        nome_ensaio: nome_ensaio,
        patologia: patologia,
        texto_ensaio: texto_ensaio,
        estado: estado,
        idu: id_utilizador
    };

    connection.query('INSERT INTO ensaio_clinico SET ?', novoEnsaio, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos com sucesso.');
        res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
        });
    });

});


app.get('/ensaios_clinicos', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;
  
    connection.query('SELECT * FROM ensaio_clinico ORDER BY idec DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
      if (err) throw err;
  
      connection.query('SELECT COUNT(*) AS count FROM ensaio_clinico', function(err, countRows) {
        if (err) throw err;
        let totalCount = countRows[0].count;
        let totalPages = Math.ceil(totalCount / perPage);
  
        res.render('ensaios_clinicos', {
            ensaiosClinicos: rows,
            currentPage: page,
            totalPages: totalPages
          }, function(err, html) {
            if (err) throw err;
            res.send(html);
          });
      });
    });
  });
  
//ROTA PARA VER OS ENSAIOS CLÍNICOS CRIADOS
app.get('/ver_ensaios', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT * FROM ensaio_clinico WHERE idu = ? ORDER BY idec DESC', [userID], function(err, rows) {
    if (err) throw err;
    res.render('ver_ensaios', {
      ensaiosClinicos: rows
    });
  });
});

//ROTA PARA EDITAR OS FORMS DOS ENSAIOS CLÍNICOS CRIADOS
app.get('/editar_ensaios', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let ensaioID = req.query.id;

  connection.query('SELECT * FROM ensaio_clinico WHERE idec = ?', [ensaioID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_ensaios', {
              ensaiosClinicos: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID do ensaio clínico especificado: ' + ensaioID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});

app.post('/editar_ensaios', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let ensaioID = req.body.ensaioID; 
  let { nome_ensaio, patologia, texto_ensaio, estado } = req.body;
  
  let updateFields = {};

  if (nome_ensaio !== "") {
    updateFields.nome_ensaio = nome_ensaio;
  }

  if (patologia !== "") {
    updateFields.patologia = patologia;
  }

  if (texto_ensaio !== "") {
    updateFields.texto_ensaio = texto_ensaio;
  }

  if (estado !== "") {
    updateFields.estado = estado;
  }


  if (Object.keys(updateFields).length > 0) {
    connection.query(
      'UPDATE ensaio_clinico SET ? WHERE idec = ?',
      [updateFields, ensaioID],
      function (err, result) {
        if (err) {
          console.error('Erro ao atualizar o evento:', err);
        } else {
          if (result.affectedRows > 0) {
            console.log('Ensaio Clínico atualizado com sucesso!');
          } else {
            console.log('Nenhum registo encontrado para o ID do ensaio clínico especificada: ' + ensaioID);
          }
        }

        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        });
      }
    );
  }
  
});

//APAGAR UM ENSAIO CLÍNICO
app.get('/apagar_ensaio', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});

app.post('/apagar_ensaio', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let ensaioID = req.body.ensaioID;

  let sql = `DELETE FROM ensaio_clinico WHERE idec = ${ensaioID}`;

  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Ensaio Clínico apagado');
    res.redirect('back');
  });
});
//-----------------------------------------------------------------------------------------------------------
//------------------------------------ CRIAR E EDITAR FORMAÇÃO ----------------------------------------------
 app.get('/criar_formacao', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }


    res.render('criar_formacao', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

app.get('/nova_formacao', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    res.render('nova_formacao')
});

app.post('/nova_formacao', (req, res) => {
    let nome_formacao = req.body.nome_formacao;
    let texto_explicativo = req.body.texto_explicativo;
    let area_formacao = req.body.area_formacao
    let max_inscricoes = req.body.max_inscricoes;
    let link_insc = req.body.link_insc;
    let duracao = req.body.duracao;
    let data_inicio = req.body.data_inicio;
    let data_fim = req.body.data_fim;



    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    let id_utilizador = req.session.userID;

    let novaFormacao = {
        nome_formacao: nome_formacao,
        texto_explicativo: texto_explicativo,
        area_formacao: area_formacao,
        max_inscricoes: max_inscricoes,
        link_insc: link_insc,
        duracao: duracao,
        data_inicio: data_inicio,
        data_fim: data_fim,
        fkf_idu: id_utilizador
    };

    connection.query('INSERT INTO formacao SET ?', novaFormacao, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos com sucesso.');
        res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
        });
    });

});

//APARECER FORMAÇÕES NA PÁGINA ABERTA AO PÚBLICO
app.get('/formacao', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;
  
    connection.query('SELECT * FROM formacao ORDER BY idf DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
      if (err) throw err;
  
      connection.query('SELECT COUNT(*) AS count FROM formacao', function(err, countRows) {
        if (err) throw err;
        let totalCount = countRows[0].count;
        let totalPages = Math.ceil(totalCount / perPage);
  
        res.render('formacao', {
            formacoes: rows,
            currentPage: page,
            totalPages: totalPages
          }, function(err, html) {
            if (err) throw err;
            res.send(html);
          });
      });
    });
  });

//ROTA PARA VER AS FORMACOES PARA EDITAR
app.get('/ver_formacoes', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT * FROM formacao WHERE fkf_idu = ? ORDER BY idf DESC', [userID], function(err, rows) {
    if (err) throw err;
    res.render('ver_formacoes', {
      formacoes: rows
    });
  });
});

//ROTA PARA EDITAR OS FORMS DAS FORMACOES CRIADOS
app.get('/editar_formacoes', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let formacaoID = req.query.id;

  connection.query('SELECT * FROM formacao WHERE idf = ?', [formacaoID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_formacoes', {
              formacoes: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID da formacao especificado: ' + formacaoID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});


app.post('/editar_formacoes', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let formacaoID = req.body.formacaoID; 
  let { nome_formacao, texto_explicativo, area_formacao, max_inscricoes, link_insc, duracao, data_inicio, data_fim } = req.body;
  
  let updateFields = {};

  if (nome_formacao !== "") {
    updateFields.nome_formacao = nome_formacao;
  }

  if (texto_explicativo !== "") {
    updateFields.texto_explicativo = texto_explicativo;
  }

  if (area_formacao !== "") {
    updateFields.area_formacao = area_formacao;
  }

  if (max_inscricoes !== "") {
    updateFields.max_inscricoes = max_inscricoes;
  }

  if (link_insc !== "") {
    updateFields.link_insc = link_insc;
  }

  if (duracao !== "") {
    updateFields.duracao = duracao;
  }

  if (data_inicio !== "") {
    updateFields.data_inicio = data_inicio;
  }

  if (data_fim !== "") {
    updateFields.data_fim = data_fim;
  }
  

  if (Object.keys(updateFields).length > 0) {
    connection.query(
      'UPDATE formacao SET ? WHERE idf = ?',
      [updateFields, formacaoID],
      function (err, result) {
        if (err) {
          console.error('Erro ao atualizar o evento:', err);
        } else {
          if (result.affectedRows > 0) {
            console.log('Formação atualizado com sucesso!');
          } else {
            console.log('Nenhum registo encontrado para o ID da formacao especificada: ' + formacaoID);
          }
        }

        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        }); 
      }
    );
  }
  
});

//APAGAR UM POST DE BLOG
app.get('/apagar_formacao', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/apagar_formacao', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let formacaoID = req.body.formacaoID;

  let sql = `DELETE FROM formacao WHERE idf = ${formacaoID}`;


  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Formação apagada');
    res.redirect('back');
  });
});
// -------------------------------------------------------------------------------------------
//------------------- CRIAR E EDITAR EVENTOS--------------------------------------------------
 app.get('/criar_evento', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }



    res.render('criar_evento', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

app.get('/novo_evento', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    res.render('novo_evento')
});

app.post('/novo_evento', upload.fields([
    { name: 'cartaz', maxCount: 1 },
    { name: 'mais_info1', maxCount: 1 }
  ]), (req, res) => {
    let titulo_evento = req.body.titulo_evento;
    let texto_evento = req.body.texto_evento;
    let entidade_organizadora = req.body.entidade_organizadora;
    let data_evento = req.body.data_evento;
    let link_inscricoes = req.body.link_inscricoes;
    let cartaz = req.files['cartaz'] ? req.files['cartaz'][0] : null;
    let mais_info1 = req.files['mais_info1'] ? req.files['mais_info1'][0] : null;
    let mais_info2 = req.body.mais_info2;
  
    if (!req.session.userID) {
      res.redirect('/login');
      return;
    }
  
    let id_utilizador = req.session.userID;
  
    let novoEvento = {
      titulo_evento: titulo_evento,
      texto_evento: texto_evento,
      entidade_organizadora: entidade_organizadora,
      data_evento: data_evento,
      link_inscricoes: link_inscricoes,
      cartaz: cartaz,
      mais_info1: mais_info1,
      mais_info2: mais_info2,
      fk_idu: id_utilizador
    };
  
    if (cartaz) {
        novoEvento.cartaz = cartaz.path.replace(/public\\/, '');
      }
      
      if (mais_info1) {
        novoEvento.mais_info1 = mais_info1.path.replace(/public\\/, '');
      }
      
  
    connection.query('INSERT INTO evento SET ?', novoEvento, (err, result) => {
      if (err) {
        console.error('Erro ao inserir dados:', err);
        return;
      }
      console.log('Dados inseridos com sucesso.');
      res.render('pagina_pessoal', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
      });
    });
  });
  
//APARECER EVENTOS NA PÁGINA ABERTA AO PÚBLICO
app.get('/eventos', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;
  
    connection.query('SELECT * FROM evento ORDER BY ide DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
      if (err) throw err;
  
      connection.query('SELECT COUNT(*) AS count FROM evento', function(err, countRows) {
        if (err) throw err;
        let totalCount = countRows[0].count;
        let totalPages = Math.ceil(totalCount / perPage);
  
        res.render('eventos', {
            eventos: rows,
            currentPage: page,
            totalPages: totalPages
          }, function(err, html) {
            if (err) throw err;
            res.send(html);
          });
      });
    });
  });
  
//ROTA PARA VER OS FORMS DOS EVENTOS CRIADOS
app.get('/ver_eventos', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT * FROM evento WHERE fk_idu = ? ORDER BY ide DESC', [userID], function(err, rows) {
    if (err) throw err;
    res.render('ver_eventos', {
      eventos: rows
    });
  });
});



//ROTA PARA EDITAR OS FORMS DOS EVENTOS CRIADOS
app.get('/editar_eventos', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let eventoID = req.query.id;

  connection.query('SELECT * FROM evento WHERE ide = ?', [eventoID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_eventos', {
              eventos: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID do evento especificado: ' + eventoID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});



app.post('/editar_eventos', upload.fields([{ name: 'cartaz', maxCount: 1 }, { name: 'mais_info1', maxCount: 1 }]), function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  let eventoID = req.body.eventoID;
  let { titulo_evento, texto_evento, entidade_organizadora, data_evento, link_inscricoes, mais_info2 } = req.body;

  let updateFields = {};

  if (titulo_evento !== "") {
    updateFields.titulo_evento = titulo_evento;
  }

  if (texto_evento !== "") {
    updateFields.texto_evento = texto_evento;
  }

  if (entidade_organizadora !== "") {
    updateFields.entidade_organizadora = entidade_organizadora;
  }

  if (data_evento !== "") {
    updateFields.data_evento = data_evento;
  }

  if (link_inscricoes !== "") {
    updateFields.link_inscricoes = link_inscricoes;
  }

  if (req.files && req.files.cartaz) {
    updateFields.cartaz = req.files.cartaz[0].path.replace(/public\\/, '');
  }

  if (req.files && req.files.mais_info1) {
    updateFields.mais_info1 = req.files.mais_info1[0].path.replace(/public\\/, '');
  }

  if (mais_info2 !== "") {
    updateFields.mais_info2 = mais_info2;
  }

  if (Object.keys(updateFields).length > 0) {
    connection.query(
      'UPDATE evento SET ? WHERE ide = ?',
      [updateFields, eventoID],
      function (err, result) {
        if (err) {
          console.error('Erro ao atualizar o evento:', err);
        } else {
          if (result.affectedRows > 0) {
            console.log('Evento atualizado com sucesso!');
          } else {
            console.log('Nenhum registo encontrado para o ID do evento especificado: ' + eventoID);
          }
        }

        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        }); 
      }
    );
  }
});

// ROTA PARA APAGAR
app.get('/apagar_evento', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/apagar_evento', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let eventoID = req.body.eventoID;

  let sql = `DELETE FROM evento WHERE ide = ${eventoID}`;

  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Evento apagado');
    res.redirect('back');
  });
});
//-------------------------------------------------------------------------------------------
// ------------------- CRIAR E EDITAR NOTICIA -------------------------------------------------
app.get('/criar_noticia', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }


    res.render('criar_noticia', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

app.get('/nova_noticia', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    res.render('nova_noticia')
});

app.post('/nova_noticia', upload.single('imagem'), (req, res) => {
    let titulo_noticia = req.body.titulo_noticia;
    let texto_noticia = req.body.texto_noticia;
    let link_original = req.body.link_original;
    let data_publicacao = req.body.data_publicacao;
    let entidade = req.body.entidade;
    let imagem = req.body.imagem;



    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    let id_utilizador = req.session.userID;

    let novaNoticia = {
        titulo_noticia: titulo_noticia,
        texto_noticia: texto_noticia,
        link_original: link_original,
        data_publicacao: data_publicacao,
        entidade: entidade,
        imagem: imagem,
        fkno_idu: id_utilizador
    };

    if (req.file) {
        novaNoticia.imagem = req.file.path.replace(/public\\/, '');
    }
    
    connection.query('INSERT INTO noticia SET ?', novaNoticia, (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            return;
        }
        console.log('Dados inseridos com sucesso.');
        res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
        });
    });

});

//APARECER NOTICIAS NA PÁGINA ABERTA AO PÚBLICO
app.get('/noticias', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;
  
    connection.query('SELECT * FROM noticia ORDER BY idn DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
      if (err) throw err;
  
      connection.query('SELECT COUNT(*) AS count FROM noticia', function(err, countRows) {
        if (err) throw err;
        let totalCount = countRows[0].count;
        let totalPages = Math.ceil(totalCount / perPage);
  
        res.render('noticias', {
            noticias: rows,
            currentPage: page,
            totalPages: totalPages
          }, function(err, html) {
            if (err) throw err;
            res.send(html);
          });
      });
    });
  });


//ROTA PARA VER AS NOTÍCIAS CRIADAS
app.get('/ver_noticias', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT * FROM noticia WHERE fkno_idu = ? ORDER BY idn DESC', [userID], function(err, rows) {
    if (err) throw err;
    res.render('ver_noticias', {
      noticias: rows
    });
  });
});

//ROTA PARA EDITAR OS FORMS DAS NOTÍCIAS CRIADAS
app.get('/editar_noticias', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let noticiaID = req.query.id;

  connection.query('SELECT * FROM noticia WHERE idn = ?', [noticiaID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_noticias', {
              noticias: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID da notícia especificada: ' + blogID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});


app.post('/editar_noticias', upload.single('imagem'), function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  let noticiaID = req.body.noticiaID;
  let { titulo_noticia, texto_noticia, link_original, data_publicacao, entidade, imagem } = req.body;

  let updateFields = {};

  if (titulo_noticia !== "") {
    updateFields.titulo_noticia = titulo_noticia;
  }

  if (texto_noticia !== "") {
    updateFields.texto_noticia = texto_noticia;
  }

  if (link_original !== "") {
    updateFields.link_original = link_original;
  }

  if (data_publicacao !== "") {
    updateFields.data_publicacao = data_publicacao;
  }

  if (entidade !== "") {
    updateFields.entidade = entidade;
  }

  if (imagem !== "") {
      updateFields.imagem = imagem;
    }

  if (req.file) {
    updateFields.imagem = req.file.path.replace(/public\\/, '');
  }

  

  if (Object.keys(updateFields).length > 0) {
    connection.query(
      'UPDATE noticia SET ? WHERE idn = ?',
      [updateFields, noticiaID],
      function (err, result) {
        if (err) {
          console.error('Erro ao atualizar a noticia:', err);
        } else {
          if (result.affectedRows > 0) {
            console.log('Evento atualizado com sucesso!');
          } else {
            console.log('Nenhum registo encontrado para o ID do blog especificado 2');
          }
        }

        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        });
      }
    );
  }
});

// ROTA PARA APAGAR 
app.get('/apagar_noticia', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/apagar_noticia', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let noticiaID = req.body.noticiaID;

  let sql = `DELETE FROM noticia WHERE idn = ${noticiaID}`;

  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Notícia apagada');
    res.redirect('back');
  });
});

//---------------------------------------------------------------------------------------------
//------------------------------ CRIAR E EDITAR NEWSLETTER -------------------------------------
app.get('/criar_newsletter', (req, res) => {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }


    res.render('criar_newsletter', {
        id_utilizador: req.session.userID,
        priv_utilizador: req.session.userPriv,
        nome_utilizador: req.session.userName,
        message: null
    });
});

app.get('/nova_newsletter', function(req, res) {
    if (!req.session.userID) {
        res.redirect('/login');
        return;
    }

    res.render('nova_newsletter')
});
app.post('/nova_newsletter', upload.single('doc'), (req, res) => {
  let titulo = req.body.titulo;
  let assunto = req.body.assunto;
  let data_publicacao = req.body.data_publicacao;
  let doc = req.body.doc;
  let id_utilizador = req.session.userID;

  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  

  let novaNewsletter = {
    titulo: titulo,
    assunto: assunto,
    data_publicacao: data_publicacao,
    doc: doc,
    fkne_idu: id_utilizador
  };

  if (req.file) {
    novaNewsletter.doc =  req.file.path.replace(/public\\/, '');
  }

  connection.query('INSERT INTO newsletter SET ?', novaNewsletter, (err, result) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return;
    }
    console.log('Dados inseridos com sucesso NEWSLETTER.');
    res.render('pagina_pessoal', {
      id_utilizador: req.session.userID,
      priv_utilizador: req.session.userPriv,
      nome_utilizador: req.session.userName,
      message: null
    });
  });
});

//APARECER NEWSLETTER NA PÁGINA ABERTA AO PÚBLICO
app.get('/newsletter', function(req, res) {
    let perPage = 10;
    let page = parseInt(req.query.page) || 1;
    let offset = (page - 1) * perPage;
  
    connection.query('SELECT * FROM newsletter ORDER BY idnews DESC LIMIT ? OFFSET ?', [perPage, offset], function(err, rows) {
      if (err) throw err;
  
      connection.query('SELECT COUNT(*) AS count FROM newsletter', function(err, countRows) {
        if (err) throw err;
        let totalCount = countRows[0].count;
        let totalPages = Math.ceil(totalCount / perPage);
  
        res.render('newsletter', {
            newsletters: rows,
            currentPage: page,
            totalPages: totalPages
          }, function(err, html) {
            if (err) throw err;
            res.send(html);
          });
      });
    });
  });


  //ROTA PARA VER AS NEWSLETTER CRIADAS
  app.get('/ver_newsletters', function(req, res) {
    if (!req.session.userID) {
      res.redirect('/login');
      return;
    }
    
    let userID = req.session.userID;
    
    connection.query('SELECT * FROM newsletter WHERE fkne_idu = ? ORDER BY idnews DESC', [userID], function(err, rows) {
      if (err) throw err;
      res.render('ver_newsletters', {
        newsletters: rows
      });
    });
  });


  //ROTA PARA EDITAR OS FORMS DAS NOTÍCIAS CRIADAS
app.get('/editar_newsletters', function(req, res) {
  if (!req.session.userID) {
      res.redirect('/login');
      return;
  }

  let newsletterID = req.query.id;

  connection.query('SELECT * FROM newsletter WHERE idnews = ?', [newsletterID], function(err, rows) {
      if (err) throw err;
      if (rows.length > 0) {
          res.render('editar_newsletters', {
              newsletters: rows
          });
      } else {
          console.log('Nenhum registo encontrado para o ID da newsletter especificada: ' + newsletterID);
          res.render('pagina_pessoal', {
            id_utilizador: req.session.userID,
            priv_utilizador: req.session.userPriv,
            nome_utilizador: req.session.userName,
            message: null
          });
      }
  });
});


app.post('/editar_newsletters', upload.single('doc'), function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }

  let newsletterID = req.body.newsletterID;
  let { titulo, assunto, data_publicacao } = req.body;
  let updateFields = {};

  if (titulo !== "") {
    updateFields.titulo = titulo;
  }

  if (assunto !== "") {
    updateFields.assunto = assunto;
  }

  if (data_publicacao !== "") {
    updateFields.data_publicacao = data_publicacao;
  }

  if (req.file) {
    updateFields.doc = req.file.path.replace(/public\\/, '');
  }


  

  if (Object.keys(updateFields).length > 0) {
    connection.query(
      'UPDATE newsletter SET ? WHERE idnews = ?',
      [updateFields, newsletterID],
      function (err, result) {
        if (err) {
          console.error('Erro ao atualizar a newsletter:', err);
        } else {
          if (result.affectedRows > 0) {
            console.log('Newsletter atualizada com sucesso!');
          } else {
            console.log('Nenhum registo encontrado para o ID da Newsletter especificada 2');
          }
        }

        res.render('pagina_pessoal', {
          id_utilizador: req.session.userID,
          priv_utilizador: req.session.userPriv,
          nome_utilizador: req.session.userName,
          message: null
        });
      }
    );
  }
});

// ROTA PARA APAGAR 
app.get('/apagar_newsletter', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/apagar_newsletter', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let newsletterID = req.body.newsletterID;

  let sql = `DELETE FROM newsletter WHERE idnews = ${newsletterID}`;

  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Newsletter apagada');
    res.redirect('back');
  });
});

//----------------------------------------------------------------------------
//--------------- VER AS CONTAS ACEITES --------------------------------------
//ROTA PARA VER AS CONTAS CRIADAS
app.get('/contas_aceites', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT idu, nome_utilizador, email, organizacao FROM utilizador WHERE aceite = 1 ORDER BY idu DESC', function(err, rows) {
    if (err) throw err;
    res.render('contas_aceites', {
      contas: rows
    });
  });
});

// ROTA PARA APAGAR 
app.get('/apagar_conta', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/apagar_conta', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let contaID = req.body.contaID;
  connection.query(
    'UPDATE utilizador SET aceite = 2 WHERE idu = ?',
    [contaID],
    function (err, result) {
      if (err) {
        console.error('Erro ao apagar a conta:', err);
      } else {
        if (result.affectedRows > 0) {
          console.log('Conta apagada com sucesso!');
          res.redirect('back');
        } else {
          console.log('Nenhum registo encontrado para o ID da conta especificada');
        }}
  });
});


//--------------- VER AS CONTAS PENDENTES --------------------------------------
//ROTA PARA VER AS CONTAS PENDENTES
app.get('/contas_pendentes', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  
  let userID = req.session.userID;
  
  connection.query('SELECT idu, nome_utilizador, email, organizacao FROM utilizador WHERE aceite = 0 ORDER BY idu DESC', function(err, rows) {
    if (err) throw err;
    res.render('contas_pendentes', {
      contas: rows
    });
  });
});

// ROTA PARA REJEITAR CONTA 
app.get('/rejeitar_conta', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/rejeitar_conta', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let contaID = req.body.contaID;
  connection.query(
    'UPDATE utilizador SET aceite = 2 WHERE idu = ?',
    [contaID],
    function (err, result) {
      if (err) {
        console.error('Erro ao rejeitar a conta:', err);
      } else {
        if (result.affectedRows > 0) {
          console.log('Conta rejeitada com sucesso!');
          res.redirect('back');
        } else {
          console.log('Nenhum registo encontrado para o ID da conta especificada');
        }}
});

});

// ROTA PARA ACEITAR CONTA 
app.get('/aceitar_conta', function(req, res) {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
});


app.post('/aceitar_conta', (req, res) => {
  if (!req.session.userID) {
    res.redirect('/login');
    return;
  }
  let contaID = req.body.contaID;
  connection.query(
    'UPDATE utilizador SET aceite = 1 WHERE idu = ?',
    [contaID],
    function (err, result) {
      if (err) {
        console.error('Erro ao aceitar a conta:', err);
      } else {
        if (result.affectedRows > 0) {
          console.log('Conta aceite com sucesso!');
          res.redirect('back');
        } else {
          console.log('Nenhum registo encontrado para o ID da conta especificada');
        }}
});

});
//----------------------------------------------------------------------------
//LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Erro ao fazer logout:', err);
            return;
        }
        res.redirect('/login');
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})