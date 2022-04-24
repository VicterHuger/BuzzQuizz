//VARIÁVEIS GLOBAIS
const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";
const paginaQuizz = document.querySelector(".tela-quiz");
let dadosQuizz;
let quizzesDisponiveis=[];
const InformacaoDoQuiz = {
    questionsAnswered: 0,
    rightAnswers: 0
};
let titulo;
let urlImagemBanner;
let numDePerguntas;
let numeroDeNiveis;
let respostasIncorretasPreenchidas=[];
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
        document.getElementById(`pergunta ${1}`).parentNode.scrollIntoView( {block: "center",behavior: "smooth"});
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
        <buton class = "refazer-quizz" onclick ="zerarQuizz()">Reiniciar Quizz</buton>
        <buton class = "voltar-home" onclick = "recarregarPagina()">Voltar pra home</buton>
    </div>`
        ;
    setTimeout(function (){
        document.querySelector(".quiz-results").parentNode.scrollIntoView({ block: "center", behavior: "smooth" });
    },2000);
}
function criarQuizz(){
    document.querySelector(".tela-inicial").classList.add("escondido");
    document.querySelector(".tela-de-criar-quizz").classList.remove("escondido");
}

/*
function conferirQuizzUsuário(){
    const id = JSON.parse(localStorage.getItem("ids"));

    const QuizzOriginal = document.querySelector(".tela-inicial");

    const QuizzQueOUsuarioCriou = document.querySelector(".seus-quizzes");

    if(id !== null && id.length !==0) {
        let apenasO.ID = [];
        ids.forEach(e => {apenasO.ID.push(ai não entendi direito.... socorro )})
        QuizzOriginal.classList.add("escondido");
        QuizzQueOUsuarioCriou.classList.remove("escondido");
        QuizzQueOUsuarioCriou.querySelector(".quizzes").innerHTML = "";
        apenasO.ID.forEach(id => getQuizz(ids, mostrarQuizzdoUsuario));

        /// ai desculpa minha nomenclatura minha cabeça tá girando aqui, mas eu acho que a lógica tá mais ou menos certa, pelo que eu li no Notion //// 

        
    }
    if(ids !== null && ids.length === 0){
        QuizzOriginaç.classList.remove("escondido");
        QuizzQueOUsuarioCriou.classList.add("escondido");
} 


function mostraQuizzdoUsuario(){
    const seusQuizzes = document.querySelector(".seus-quizzes .quizzes")

    seusQuizzes.innerHTML = `
    <div class = "quizz">
        <div class = "conteudo-quizz" onclick = "pegarQuizz(${response.data.id}, abrirpaginaQuizz)">
        <img src = ${response.data.image} alt = "$(responde.data.title)">
            <div class = "nome-do-quizz">
                ${response.data.title}
            </div>
        </div>
    </div>
    <div class = "botao-de-editar-quizz">
        <colocar aqui o ion icon de editar os quizz. não pensei nisso ainda, sorry >        `

} 




/////// ahhh e eu vi alguma coisa sobre deletar o quizz, ainda não sei ao certo como fazer, nem isso que eu escrevi eu sei se tá certo, mas pensei em alguma coisa também ////// 
*/
function verificarDadosIniciais(){
    titulo=document.getElementById("titulo").value;
    urlImagemBanner=document.getElementById("url").value;
    numDePerguntas=document.getElementById("perguntas").value;
    numeroDeNiveis=document.getElementById("niveisquizz").value;
    document.getElementById("titulo").value="";
    document.getElementById("url").value="";
    document.getElementById("perguntas").value="";
    document.getElementById("niveisquizz").value="";
    if(isValidTitle(titulo)){
        return alert("Título inserido é inválido! Digite um titulo com no mínimo 20 caracteres e no máximo 65 caracteres");
    }
    if((!isValidURL(urlImagemBanner))){ 
        return alert("URL inserida é inválida! Digite uma URL válida!");
    }
    if(!isImgLink(urlImagemBanner)){
        return alert("URL inserida é inválida! Digite uma URL de uma imagem!")
    }
    if(isNaN(Number(numDePerguntas)) || Number(numDePerguntas)<3){
        return alert("Número de perguntas inválido! Digite um número maior ou igual a 3");
    }
    if(isNaN(Number(numeroDeNiveis)) || Number(numeroDeNiveis)<2){
        return alert("Número de níveis inválido! Digite um número maior ou igual a 2");
    }
    document.querySelector(".tela-de-criar-quizz").classList.add("escondido");
    document.querySelector(".tela-de-gerar-perguntas").classList.remove("escondido");
    document.querySelector(".tela-de-gerar-perguntas").innerHTML=`
    <h3>Crie suas perguntas</h3>
    <form class="forms-perguntas" id="forms-pergunta-1" action="/" method="get"></form>`;
    document.getElementById("forms-pergunta-1").innerHTML=renderizarForumlarioPerguntas(1);
    for(let i=1;i<numDePerguntas;i++){
        document.querySelector(".tela-de-gerar-perguntas").innerHTML+=`
        <form class="forms-clicavel" id="forms-pergunta-${i+1}" onclick="expandirFormulario(this)" action="/" method="get">
            <h4>Pergunta ${i+1}</h4>
            <ion-icon  class="icone-editar" name="create-outline"></ion-icon>
        </form>`;
    }
    document.querySelector(".tela-de-gerar-perguntas").innerHTML+=`<button class="criar-niveis" onclick="verificarPerguntas()">Prosseguir pra criar níveis</button>`;

    //DEPOIS COLOCAR O ONCLICK NO BOTÃO DE PROSSEGUIR E USAR PROVAVELMENTE OS QUATRO ELEMENTOS DEFINIDOS COMO GLOBAIS; 
}
function isValidTitle(string){
    return(typeof(string)!=="string" || string.length<20 || string.length>65);
}
function isValidURL(string) {
    let resposta = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (resposta !== null)
};
function isImgLink(url) {
    if(typeof url !== 'string') return false;
    return(url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) != null);
}
function expandirFormulario(elemento){
    const id=elemento.id;
    const numId=Number(id.replace("forms-pergunta-",""));
    document.getElementById(id).classList.remove("forms-clicavel");
    document.getElementById(id).classList.add("forms-perguntas");
    document.getElementById(id).innerHTML="";
    document.getElementById(id).innerHTML=renderizarForumlarioPerguntas(numId);
    elemento.removeAttribute("onclick");

}
function verificarPerguntas(){
    const formsNaoPreenchidos=document.querySelector(".tela-de-gerar-perguntas").querySelectorAll(".forms-clicavel");
    const elementosTextoPergunta=document.querySelector(".tela-de-gerar-perguntas").querySelectorAll("#texto-da-pergunta");
    const elementosPerguntasInvalidos=Array.from(elementosTextoPergunta).filter(elemento=>(elemento.value.length<20));
    const elementosCores=document.querySelector(".tela-de-gerar-perguntas").querySelectorAll("#cor-de-fundo");
    const elementosCoresSemiValidos=Array.from(elementosCores).filter(elemento=>(elemento.value[0]==="#" && elemento.value.length===7));
    const elementosUrlImagens=document.querySelector(".tela-de-gerar-perguntas").querySelectorAll(".url");
    const elementosURLImagensPreenchidos=Array.from(elementosUrlImagens).filter(element=>element.value!=="");
    const elementosURLImagensValidas=Array.from(elementosURLImagensPreenchidos).filter(element=>isValidURL(element.value)).filter(element=>isImgLink(element.value));
    const inputsRespostasCertas=document.querySelectorAll("#resposta-correta");
    const respostasCertasPreenchidas=Array.from(inputsRespostasCertas).filter(element=>element.value!=="");
    const elementosURLImagensRespostasCorretas=document.querySelector(".tela-de-gerar-perguntas").querySelectorAll("#url-img-correta");
    const elementosURLImagensRespostasCorretasPreenchidos=Array.from(elementosURLImagensRespostasCorretas).filter(element=>element.value!=="");
    if(formsNaoPreenchidos.length>0){
        return alert("Preencha todos as perguntas disponíveis!");
    }
    if(elementosPerguntasInvalidos.length>0){
        return alert("Texto da pergunta inválido! Digite uma pergunta com no mínimo 20 caracteres");
    }
    if(elementosCoresSemiValidos.length!==elementosCores.length){
        return alert("Cor inserida inválida! Digite uma cor em formato hexadecimal");
    }else{
        for (let i=0;i<elementosCoresSemiValidos.length;i++){
            for (let j=1;j<elementosCoresSemiValidos[i].value.length;j++){
                if(!contemNumeroAF){
                    return alert("Cor inserida inválida! Digite uma cor em formato hexadecimal");
                }
            }
        }
    }
    if(inputsRespostasCertas.length!==respostasCertasPreenchidas.length){
        return alert("Preencha todos os campos das respostas certas");
    }
    if(elementosURLImagensRespostasCorretasPreenchidos.length!==respostasCertasPreenchidas.length){
        return alert("Preencha todas as URL dos campos de URL imagem correta");
    }
    for (let i=0;i<numDePerguntas;i++){
        if(!verificarRespostasIncorretasVazias(i+1)){
            return alert(`"Preencha pelo menos uma resposta incorreta na pergunta ${i+1}"`);
        }
    }
    for (let i=0;i<numDePerguntas;i++){
        if(!verificarURLvazias(i+1)){
            return alert(`"Preencha ${respostasIncorretasPreenchidas[i]} URL das imagens das respostas incorretas da pergunta ${i+1}"`);
        }
    }
    if(elementosURLImagensPreenchidos.length!==elementosURLImagensValidas.length){
        return alert("URL inserida é inválida! Digite uma URL de uma imagem!");
    }
    criarNiveis();
}
function verificarRespostasIncorretasVazias(numero){
    const respostasIncorretas=document.getElementById(`forms-pergunta-${numero}`).querySelectorAll("[name='resposta-incorreta']");
    respostasIncorretasPreenchidas[numero-1]=(Array.from(respostasIncorretas).filter(element=>element.value!=="").length);
    if(respostasIncorretasPreenchidas[numero-1]===0){
        return false;
    }
    return true;
}
function verificarURLvazias(numero){
    const urls=document.getElementById(`forms-pergunta-${numero}`).querySelectorAll("[name='url-img']");
    const urlsPreenchidas=Array.from(urls).filter(element=>element.value!=="");
    if(urlsPreenchidas.length===0){
        return false;
    }else if(urlsPreenchidas.length===respostasIncorretasPreenchidas[numero-1]){
        return true;
    }
    return false;
}

function contemNumeroAF(caracter){
    if(typeof(Number(caracter))==="number"){
        return true;
    }
    if(typeof(caracter)==="string" && (caracter.toLocaleLowerCase()==="a" || caracter.toLocaleLowerCase()==="b" || caracter.toLocaleLowerCase()==="c" || caracter.toLocaleLowerCase()==="d" || caracter.toLocaleLowerCase()==="e" || caracter.toLocaleLowerCase()==="f") ){
        return true;
    }
    return false;
}
function renderizarForumlarioPerguntas(numero){
    return(`
      <h4>Pergunta ${numero}</h4>
      <div>
        <input type="text" id="texto-da-pergunta" name="texto-da-pergunta" placeholder="Texto da pergunta">
        <input type="text" id="cor-de-fundo" name="cor-de-fundo" placeholder="Cor de fundo da pergunta">
      </div>
      <h4>Resposta correta</h4>
      <div> 
        <input type="text" id="resposta-correta" name="resposta-correta" placeholder="Resposta correta">
        <input type="text" class="url" id="url-img-correta" name="url-resposta-correta" placeholder="URL da imagem">
      </div>
      <h4>Respostas incorretas</h4>
      <div>
        <input type="text" id="resposta-incorreta-1" name="resposta-incorreta" placeholder="Resposta incorreta 1">
        <input type="text" class="url" id="url-img-1" name="url-img" placeholder="URL da imagem 1">
     </div>
     <div>
        <input type="text" id="resposta-incorreta-2" name="resposta-incorreta" placeholder="Resposta incorreta 2">
        <input type="text" class="url" id="url-img-2" name="url-img" placeholder="URL da imagem 2">
     </div>
     <div>
        <input type="text" id="resposta-incorreta-3" name="resposta-incorreta" placeholder="Resposta incorreta 3">
        <input type="text" class="url" id="url-img-3" name="url-img" placeholder="URL da imagem 3">
     </div>`);
}
function criarNiveis(){
    document.querySelector(".tela-de-gerar-perguntas").classList.add(".escondido");
    //FALTA ARMAZENAR OS DADOS DAS PERGUNTAS NO OBJETO CORRETO;
    //document.querySelector(".tela-de-gerar-perguntas").innerHTML="";
}
function EnviarQuizzesParaOServidor(){
    let variavelQueEnviaParaoServidor = {
        title: document.querySelector(".titulo").value,
        image: document.querySelector(".url-image").value,
        questions: questions,
        levels: levels

    }
     let promessaDeEnviarAoServidor = axios.post('https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes', variavelQueEnviaParaoServidor)
     promessaDeEnviarAoServidor.then(PaginaFinal)//aqui chama a página do quiz final 
     promessaDeEnviarAoServidor.cath(MostrarErroAoEnviar) // aqui mostra a fução de erro 
}

function MostrarErroAoEnviar (resposta){
    console.log("Houve um erro ao enviar", resposta)
}

function verificarIdSalvos(){
    arrayDeIds = localStorage.getItem("idSalvo")

    if (arrayDeIds == null){
        arrayDeIds = "[]";
    }
    arrayDeIds = JSON.parse(arrayDeIds)

    if (arrayDeIds.length > 0 ){
        document.querySelector(".telaParaCriaroQuiz").classList("escondido");
        BuscarQuizzdoUsuario();
    }
    else {
        document.querySelector("tela2paraCriaroQuiz").classList.add("escondido");
    }
}

function salvarNoNavegador (okRecebiOID){
    let variaveldoID = 0;
    variavedoID = okRecebiOID

    arrayDeIds.push(variaveldoID)

    localStorage.setItem("idSalvo", arrayDeIds);
}

function BuscarQuizzdoUsuario (){
    for(let i=0; i<arrayDeIds.length; i++){
        let promessaDeBuscaDeQuizzPeloIdsDoUsuario = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes${arrayDeIds[i]}`)
        promessaDeBuscaDeQuizzPeloIdsDoUsuario.then(renderizarQuizzesDoUsuario)
    }
}
