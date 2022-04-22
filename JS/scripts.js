const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

const JogarNovoQuizz = document.querySelector(".pagina_quizz");
const CriarNovoQuizz = document.querySelector(".criar_novo_quizz");
const paginaQuizz = document.querySelector(".tela-quiz");

const CarregandoQuizzes = document.querySelector(".carregar-pagina");
let dadosQuizz;

let quizzesDisponiveis  = [];

const InformacaoDoQuiz = {
    questionsAnswered: 0,
    rightAnswers: 0
};

carregarTodosQuizzes();

function recarregarPagina(){
    window.scrollTo(1,0);
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
        document.getElementById(`pergunta ${1}`).parentNode.parentNode.scrollIntoView();
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
            document.getElementById(`pergunta ${numIdElement+1}`).parentNode.parentNode.scrollIntoView();
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
    `<div>
        <section class = "quiz-results">
            <h3>${score}% de acerto: ${dadosQuizz.levels[level].title}</h3>
            <div>
                <img src="${dadosQuizz.levels[level].image}"/>
                <p>${dadosQuizz.levels[level].text}</p>
            </div>
        </section>
    </div>`;
    setTimeout(function (){
        document.querySelector(".quiz-results").parentNode.scrollIntoView();
    },2000);
    
}