const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";

const JogarNovoQuizz = document.querySelector(".pagina_quizz");
const CriarNovoQuizz = document.querySelector(".criar_novo_quizz");
const paginaInicial = document.querySelector(".todos-os-quizzes");
const CarregandoQuizzes = document.querySelector(".carregar-pagina");

let quizzesDisponiveis  = [];

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
    promise=axios.get(APPI_URL);
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
    document.querySelector("main").classList.add("escondido");
}