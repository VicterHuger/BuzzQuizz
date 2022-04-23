//VARIÁVEIS GLOBAIS
const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";
const paginaQuizz = document.querySelector(".tela-quiz");
let dadosQuizz;
let quizzesDisponiveis=[];
const InformacaoDoQuiz = {
    questionsAnswered: 0,
    rightAnswers: 0
};
//const JogarNovoQuizz = document.querySelector(".pagina_quizz");
//const CriarNovoQuizz = document.querySelector(".criar_novo_quizz");
//const CarregandoQuizzes = document.querySelector(".carregar-pagina");
/*const quizzesValidos = {
    id:"",
    title: "", 
    image: "", 
    questions: [],
    levels: []
}*/
//CHAMANDO FUNÇÃO
carregarTodosQuizzes();

function recarregarPagina(){
    window.scrollTo(1,0);
    window.location.reload();
}
// function carregandoQuizzes(){
//     CarregandoQuizzes.classList.remove("escondido");
    
//     if (CarregandoQuizzes.classList.contains("quizzCarregado")){
//         CarregandoQuizzes.classList.add("escondido");
//         CarregandoQuizzes.classList.remove("quizzCarregado");
//     }
//     else{
//         CarregandoQuizzes.classList.add("quizzCarregando");
//     }
// }
// function quizzesCarregados(){
//     CarregandoQuizzes.classList.add("quizzCarregado");
//     if(CarregandoQuizzes.classList.contains("quizzCarregando")){
//         CarregandoQuizzes.classList.remove("escondido");
//         CarregandoQuizzes.classList.remove("quizzCarregando");
//     }
// }
function carregarTodosQuizzes(){
    const promise=axios.get(APPI_URL);
    promise.then(renderizarQuizzes);
    promise.catch(tratarErroCarregarQuizzes);
}
function renderizarQuizzes(resposta){
    quizzesDisponiveis=[resposta.data];
    qntQuizzes=quizzesDisponiveis[0].length;
    const elementoQuizzes=document.querySelector(".quizzes");
    elementoQuizzes.innerHTML=``;
    for (let i=0;i<qntQuizzes;i++){
        elementoQuizzes.innerHTML+=
        `<div class="quizz" id="${quizzesDisponiveis[0][i].id}" onclick="abrirPaginaQuizz(this)">
            <img src="${quizzesDisponiveis[0][i].image}" alt="Imagem ilustrativa do quizz">
            <div class="efeito-gradiente">
                <h3>${quizzesDisponiveis[0][i].title}</h3>
            </div>
        </div>`
    }
}
function tratarErroCarregarQuizzes(erro){
    alert(`Erro ao carregar os quizzes existentes: Erro número ${erro.response.status}`);
    recarregarPagina();
}
function abrirPaginaQuizz(elemento){
    const ID_DO_QUIZZ=elemento.id;
    const promise=axios.get(`${APPI_URL}/${ID_DO_QUIZZ}`);
    promise.then(renderizarQuizz);
    promise.catch(tratarErroAbrirQuizz);
}
function renderizarQuizz(resposta){
    document.querySelector(".tela-inicial").classList.add("escondido");
    document.querySelector(".tela-quiz").classList.remove("escondido");
    document.querySelector("header").scrollIntoView();
    dadosQuizz = resposta.data;
    exibirQuizz(resposta.data);
}
function tratarErroAbrirQuizz(erro){
    alert(`Erro ao abri o quizz selecionado: Erro número ${erro.response.status}`);
    recarregarPagina();
}
function embaralha() {
    return Math.random() -0.5;
}
function exibirQuizz (quizz){
    title= quizz.title;
    bannersrc = quizz.image;
    const telaQuiz=document.querySelector(".tela-quiz");
    telaQuiz.innerHTML=`
    <header class = "quiz-banner">
        <img class = "banner-image" src="${bannersrc}">
        <div class="efeito-gradiente-banner">
            <span class = "quiz-title ">${title}</span>
        </div>
    </header>`
    let embaralhaResposta = [];
    paginaQuizz.innerHTML += `<div class = "quiz-questions"></div>`;
    let id;
    for (let i = 0; i < quizz.questions.length; i++){
        document.querySelector(".quiz-questions").innerHTML += `
        <div>
        <div class = "quiz-question">
        <h3 style = "background-color:${quizz.questions[i].color}">${quizz.questions[i].title}</h3>
        <ul class = "opcoes-respostas" id = "pergunta ${i+1}">
        </ul>
    </div>
    </div>`
        embaralhaResposta = quizz.questions[i].answers.sort(embaralha);
        for (let j = 0; j < embaralhaResposta.length; j++){
            document.getElementById(`pergunta ${i+1}`).innerHTML +=
                `<li class = "opcao" id = "${embaralhaResposta[j].isCorrectAnswer}" onclick = "escolherResposta(this)">
                    <img src="${embaralhaResposta[j].image}" alt="Option Imagem"/>
                    <span>${embaralhaResposta[j].text}</span>           
                </li>`;        
        }
    }
    setTimeout(function (){
        document.getElementById(`pergunta ${1}`).parentNode.scrollIntoView( {block: "center"});
},2000)
}
function escolherResposta(element){
    const respostas = element.parentNode.querySelectorAll("li");
    const qntRespostas=respostas.length;
    for(let i = 0; i < qntRespostas; i++){
        
        respostas[i].removeAttribute("onclick");
        if(respostas[i].id==="true"){
            respostas[i].querySelector("span").style.color="#009C22";
            if(element.querySelector("span")===respostas[i].querySelector("span")){
                InformacaoDoQuiz.rightAnswers++;
            }
        }else{
            respostas[i].querySelector("span").style.color="#FF4B4B";
            respostas[i].classList.add("efeito-esbranquicado");
        }
    }
    const idElement=element.parentNode.id;
    const numIdElement=pegarNumeroIdUl(idElement);
    if(document.getElementById(`pergunta ${numIdElement+1}`)!==null){
        setTimeout(function (){
            document.getElementById(`pergunta ${numIdElement+1}`).parentNode.scrollIntoView({ block: "center", behavior: "smooth" });
    },2000)
    
    }
    finalizarQuizz();
}
function pegarNumeroIdUl(str){
    return  Number(str.replace("pergunta ",""));
}
function finalizarQuizz(){
    const elementosRespostas=document.querySelectorAll("li>span");
    InformacaoDoQuiz.questionsAnswered=Array.from(elementosRespostas).filter(elemento=>elemento.style.color==="rgb(0, 156, 34)").length;
    const numPerguntas=document.querySelectorAll(".quiz-question>ul").length;
    if(InformacaoDoQuiz.questionsAnswered===numPerguntas){
        mostrarResultado();
    }
}
function zerarQuizz (){
    paginaQuizz.innerHTML = "";
    exibirQuizz(dadosQuizz);
    scrollTo(0,0);
    InformacaoDoQuiz.questionsAnswered =0;
    InformacaoDoQuiz.rightAnswers=0;
}
function mostrarResultado(){
     const score = Math.round((InformacaoDoQuiz.rightAnswers/InformacaoDoQuiz.questionsAnswered)*100);
     console.log(score);
     let level = 0;

    for (let i = 0; i< dadosQuizz.levels.length; i++){
        if(score >= dadosQuizz.levels[i].minValue){
            level = i;
        }
     }
    paginaQuizz.innerHTML+=
    `<section class = "quiz-results">
            <h3>${score}% de acerto: ${dadosQuizz.levels[level].title}</h3>
            <div>
                <img src="${dadosQuizz.levels[level].image}"/>
                <p>${dadosQuizz.levels[level].text}</p>
            </div>
        </section>
        <buton class = "refazer-quizz" onclick ="zerarQuizz()">Reiniciar Quizz</buton>
        <buton class = "voltar-home" onclick = "recarregarPagina()">Voltar pra home</buton>`
        ;
    setTimeout(function (){
        document.querySelector(".quiz-results").scrollIntoView();
    },2000);
}
function criarQuizz(){
    document.querySelector(".tela-inicial").classList.add("escondido");
    document.querySelector(".tela-de-criar-quizz").classList.remove("escondido");
}
function verificarDadosIniciais(){
    const titulo=document.getElementById("titulo").value;
    const urlImagem=document.getElementById("url").value;
    const numDePerguntas=document.getElementById("perguntas").value;
    const numeroDeNiveis=document.getElementById("niveisquizz").value;
    document.getElementById("titulo").value="";
    document.getElementById("url").value="";
    document.getElementById("perguntas").value="";
    document.getElementById("niveisquizz").value="";
    //Título do quizz: deve ter no mínimo 20 e no máximo 65 caracteres
    if(isValidTitle(titulo)){
        return alert("Título inserido é inválido! Digite um titulo com no mínimo 20 caracteres e no máximo 65 caracteres");
    }
    if(!isValidURL(urlImagem)){
        return alert("URL inserida é inválida! Digite uma URL válida!");
    }
    if(isNaN(Number(numDePerguntas)) || Number(numDePerguntas)<3){
        return alert("Número de perguntas inválido! Digite um número maior ou igual a 3");
    }
    if(isNaN(Number(numeroDeNiveis)) || Number(numeroDeNiveis)<2){
        return alert("Número de níveis inválido! Digite um número maior ou igual a 2");
    }
    document.querySelector(".tela-de-criar-quizz").classList.add("escondido");
    document.querySelector(".tela-de-gerar-perguntas").classList.remove("escondido");
    //IDEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA A CONTINUAR
    //ADICIONAR OS ELEMENTOS DO HTML DAS PERGUNTAS A SEREM INSERIDAS AQUI
    //DEPOIS COLOCAR O ONCLICK NO BOTÃO DE PROSSEGUIR E USAR PROVAVELMENTE OS QUATRO ELEMENTOS DEFINIDOS COMO GLOBAIS; 
}
function isValidTitle(string){
    return(typeof(string)!=="string" || string.length<20 || string.length>65);
}
function isValidURL(string) {
    let resposta = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (resposta !== null)
};

// function validURL(str) {
//     let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
//       '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
//       console.log(!!pattern.test(str));
//     return !!pattern.test(str);
// }
/*function inicioDaCriacao(quizzBasico){
    let questionValue = "";

    let numeroDeNiveis=document.getElementById("niveisquizz");
     = "";

    if(!quizzBasico){
        quizzesValidos = {
            id:"",
            title: "", 
            image: "", 
            questions: [],
            levels: []
        }
    }else {
        quizzesValidos = quizzBasico;
        numeroDeQuestoes = quizzBasico.questions.length;
        numeroDeNiveis=document.getElementById("niveisquizz");
         = quizzBasico.levels.length;
    }
    const telaCriarQuiz = document.querySelector(".quizz-lista");
    telaCriarQuiz.classList.add("escondido");
    CriarNovoQuizz.innerHTML = `
    <span class = "titulo">Comece pelo começo</span>
    <div class = "informacoes-basicas">
        <input type = "text" placeholder = "Título do seu quizz" value = "${quizzesValidos.title}">
        <input type = "text" placeholder = "URL da imagem do seu quizz" value = "${quizzesValidos.image}">
        <input type = "number" placeholde = "Quantidade de perguntas no quizz " value = "${numeroDeQuestoes}"
    </div>
    <button class = "informacoes-iniciais" onclick = "irParaPerguntas()" >Prosseguir para criar perguntas</button>  
    `
}
function criarPergunta(){
    CriarNovoQuizz.innerHtml = `
    <span class = "titulo"> Crie sua perguntas </span>
    <ul class = "novas-questoes">
        ${escreverPerguntas()
    </ul>
    <button class = "criar-questoes" onclinck = "criarLevels()"> Prosseguir para criar níveis </button>;
}
function escreverPerguntas(){
}
*/

  