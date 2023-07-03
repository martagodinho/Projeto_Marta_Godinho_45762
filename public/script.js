let userInfoSuper = document.getElementById('user-super');
let userPrivSuper = userInfoSuper.getAttribute('data-id');


let userInfoNewsletter = document.getElementById('user-newsletter');
let userPrivNewsletter = userInfoNewsletter.getAttribute('data-id');

let userInfoNoticia = document.getElementById('user-noticia');
let userPrivNoticia = userInfoNoticia.getAttribute('data-id');

let userInfoEvento = document.getElementById('user-evento');
let userPrivEvento = userInfoEvento.getAttribute('data-id');

let userInfoFormacao = document.getElementById('user-formacao');
let userPrivFormacao = userInfoFormacao.getAttribute('data-id');


let userInfoBlog = document.getElementById('user-blog');
let userPrivBlog = userInfoBlog.getAttribute('data-id');

let userInfoTestemunhos = document.getElementById('user-testemunho');
let userPrivTestemunhos = userInfoTestemunhos.getAttribute('data-id');

let userInfoEnsaio = document.getElementById('user-ensaio_clinico');
let userPrivEnsaio = userInfoEnsaio.getAttribute('data-id');


let eventoBox = document.getElementById('eventoBox')
let blogBox = document.getElementById('blogBox')
let formacaoBox = document.getElementById('formacaoBox')
let ensaioBox = document.getElementById('ensaioBox')
let noticiasBox = document.getElementById('noticiasBox')
let newsletterBox = document.getElementById('newsletterBox')
let testemunhoBox = document.getElementById('testemunhoBox')
let contasBox = document.getElementById('contaBox')

if (userPrivNewsletter==1){
    newsletterBox.style.display="flex";
} 

if (userPrivNoticia==1){
    noticiasBox.style.display="flex";
} 

if (userPrivEvento==1){
    eventoBox.style.display="flex";
} 

if (userPrivFormacao==1){
    formacaoBox.style.display="flex";
} 

if (userPrivBlog==1){
    blogBox.style.display="flex";
} 

if (userPrivTestemunhos==1){
    testemunhoBox.style.display="flex";
} 

if (userPrivEnsaio==1){
    ensaioBox.style.display="flex";
} 

if (userPrivSuper==1){
    contasBox.style.display="flex";
} 





function formatarData(data) {
  const dataObj = new Date(data);
  const dia = dataObj.getDate();
  const mes = dataObj.getMonth() + 1;
  const ano = dataObj.getFullYear();
  return `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${ano}`;
}

function escapeSpecialCharacters(str) {
  // Caracteres especiais que precisam ser escapados
  var specialChars = /[.*+?^${}()|[\]\\]/g;

  // Função de substituição para escapar o caractere
  function escapeChar(match) {
    return '\\' + match;
  }

  // Substituir todos os caracteres especiais pela sequência de escape
  return str.replace(specialChars, escapeChar);
}