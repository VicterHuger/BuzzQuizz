const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes"

const JogarNovoQuizz = document.querySelector(".pagina_quizz")
const CriarNovoQuizz = document.querySelector(".criar_novo_quizz")
const PaginaInicial = document.querySelector(".todos-os-quizzes")
const CarregandoQuizzes = document.querySelector(".carregar-pagina")

let quizzesDisponíveis  = [];

function recarregar(){
    window.location.reload();
    console.log("bora testar")

}

function carregandoQuizzes(){
    CarregandoQuizzes.classList.remove("escondido")
    
    if (CarregandoQuizzes.classList.contains("quizzCarregado")){
        CarregandoQuizzes.classList.add("escondido")
        CarregandoQuizzes.classList.remove("quizzCarregado")
    }
    else{
        CarregandoQuizzes.classList.add("quizzCarregando")
    }

}

function quizzesCarregados(){
    CarregandoQuizzes.classList.add("quizzCarregado")
    if(CarregandoQuizzes.classList.contains("quizzCarregando")){
        CarregandoQuizzes.classList.remove("escondido")
        CarregandoQuizzes.classList.remove("quizzCarregando")
    }
}

