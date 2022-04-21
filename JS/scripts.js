const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

const JogarNovoQuizz = document.querySelector(".pagina_quizz");
const CriarNovoQuizz = document.querySelector(".criar_novo_quizz");
const paginaInicial = document.querySelector(".todos-os-quizzes");
const CarregandoQuizzes = document.querySelector(".carregar-pagina");

let quizzesDisponiveis  = [];

const InformacaoDoQuiz = {
    questionsAnswered: 0,
    levels: [],
    rightAnswers: 0
};

carregarTodosQuizzes();

function recarregarPagina(){
    window.location.reload();
}

function carregandoQuizzes(){
    CarregandoQuizzes.classList.remove("escondido");
    
    if (CarregandoQuizzes.classList.contains("quizzCarregado")){
        CarregandoQuizzes.classList.add("escondido");
        CarregandoQuizzes.classList.remove("quizzCarregado");
    }
    else{
        CarregandoQuizzes.classList.add("quizzCarregando");
    }

}

function quizzesCarregados(){
    CarregandoQuizzes.classList.add("quizzCarregado");
    if(CarregandoQuizzes.classList.contains("quizzCarregando")){
        CarregandoQuizzes.classList.remove("escondido");
        CarregandoQuizzes.classList.remove("quizzCarregando");
    }
}

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
    console.log(resposta.data)
    exibirQuizz(resposta.data);
}

function tratarErroAbrirQuizz(erro){
    alert(`Erro ao abri o quizz selecionado: Erro número ${erro.response.status}`);
    recarregarPagina();
}

function exibirQuizz (quizz){
    //const title = paginaInicial.querySelector(".quiz-title");
    title= quizz.title;

    //const banner = paginaInicial.querySelector(".banner-image");
    bannersrc = quizz.image;
    const telaQuiz=document.querySelector(".tela-quiz");
    telaQuiz.innerHTML=`
    <header class = "quiz-banner">
        <img class = "banner-image" src="${bannersrc}">
        <div class="efeito-gradiente-banner">
            <span class = "quiz-title ">${title}</span>
        </div>
    </header>`
    telaQuiz.innerHTML+=`<section class="quiz-questions">
    <section class = "quiz-question">
        <h3>PERGUNTA PARA VOCE CARO LEITOR, BELEZA? </h3>
        <ul class="opcoes-respostas">
            <li class="resposta">

            </li>
            <li class="resposta">
                
            </li>
            <li class="resposta">
                
            </li>
            <li class="resposta">
                
            </li>
        </ul>
    </section>
</section>
<section class = "quiz-results"></section>`
    return; //tirar Return para continuar

    const questions = paginaInicial.querySelector(".quizz-questions");
    questions.innerHTML = "";

    InformacaoDoQuiz.levels = quizz.levels;
    let embaralhaResposta;
    let respostas="";
    let question="";
    for (let i = 0; i < quizz.question.length; i++){
        respostas = "";
        embaralhaResposta = quizz.questions[i].respostas.sort(randomize);
        for (let j = 0; j < embaralhaResposta.lengnt; j++){
            respostas +=
        `<li class = "opcao" onclick = "escolherResposta(this)">
            <img scr = "${embaralhaResposta[j].image}" alt = "Option Imagem">
            <span>${embaralhaResposta[j].text}</span>
            <span class = "valor escondido">${embaralhaResposta[j].RespostaCorreta}</span>        
        </li>`
        }
        if (quizz.questions[i].color.toLowerCase() === "#ffffff"){
            question.innerHTML +=
            `<div class = "question">
                <div class = "question-title" style = "background-color:${quizz.questions[i].color}">
                <span>${quizz.questions[i].title}</span>
                </div>
            </div>`
        }
        else {
            questions.innerHTML += 
            `<div class = "question">
                <div class = "question-title" stlyle = "background-color:${quizz.question[i].color}"
                </div>
            </div>`
        }
    }
    zerarQuizz();
}
