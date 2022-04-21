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
    promise.then(abrirQuizz);
    promise.catch(TratarErroAbrirQuizz);
}
function abrirQuizz(resposta){
    document.querySelector("main").classList.add("escondido");
}

function exibirQuizz (){
    const title = paginaInicial.querySelector(".quiz-title");
    title.innerText = quizz.data.title;

    const banner = paginaInicial.querySelector(".banner-image");
    banner.src = quizz.data.image;

    const questions = paginaInicial.querySelector(".quizz-questions");
    questions.innerHTML = "";

    InformacaoDoQuiz.levels = quizz.data.levels;
    
    for (let i = 0; i < quizz.data.question.length; i++){
        let embaralhaResposta = quizz.data.questions[i].respostas.sort(randomize);
        let respostas = ""
        for (let j = 0; j < embaralhaResposta.lengnt; j++){
            respostas +=
        `<li class = "opcao" onclick = "escolherResposta(this)">
            <img scr = "${embaralhaResposta[j].image}" alt = "Option Imagem">
            <span>${embaralhaResposta[j].text}</span>
            <span class = "valor escondido">${embaralhaResposta[j].RespostaCorreta}</span>        
        </li>`
        }
        if (quizz.data.questions[i].color.toLowerCase() === "#FFFFFF"){
            question.innerHTML +=
            `<div class = "question">
                <div class = "question-title" style = "background-color:${quizz.data.questions[i].color}">
                <span>${quizz.data.questions[i].title}</span>
                </div>
            </div>`
        }
        else {
            questions.innerHTML += 
            `<div class = "question">
                <div class = "question-title" stlyle = "background-color:${quizz.data.question[i].color}"
                </div>
            </div>`
        }
    }
    zerarQuizz();
}
