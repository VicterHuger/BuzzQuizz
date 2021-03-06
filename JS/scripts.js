//VARIÁVEIS GLOBAIS
const APPI_URL = "https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes";
const paginaQuizz = document.querySelector(".tela-quiz");
let dadosQuizz;
let ID_QUIZZ_USUARIO;
let quizzesDisponiveis=[];
let quizzesDoUsuario=[];
let idsDeserializados=[];
const InformacaoDoQuiz = {
    questionsAnswered: 0,
    rightAnswers: 0
}
let numDePerguntas;
let numeroDeNiveis;
let numRespostasIncorretasPreenchidas=[];
const quizzUsuario={
	title: "",
	image: "",
	questions: [
		{
			title: "",
			color: "",
			answers: [
				{
					text: "",
					image: "",
					isCorrectAnswer: null
				},
				{
					text: "",
					image: "",
					isCorrectAnswer: null
				}
			]
		},
		{
			title: "",
			color: "",
			answers: [
				{
					text: "",
					image: "",
					isCorrectAnswer: null
				},
				{
					text: "",
					image: "",
					isCorrectAnswer: null
				}
			]
		},
		{
			title: "",
			color: "",
			answers: [
				{
					text: "",
					image: "",
					isCorrectAnswer: null
				},
				{
					text: "",
					image: "",
					isCorrectAnswer: null
				}
			]
		}
	],
	levels: [
		{
			title: "",
			image: "",
			text: "",
			minValue: 0
		},
		{
			title: "",
			image: "",
			text: "",
			minValue: 0
		}
	]
}
//const CarregandoQuizzes = document.querySelector(".carregar-pagina");
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
    console.log(quizzesDisponiveis);
    let qntQuizzes=quizzesDisponiveis[0].length;
    console.log(quizzesDisponiveis[0][1])
    console.log(qntQuizzes)
    const elementoQuizzes=document.querySelector(".quizzes");
    elementoQuizzes.innerHTML=``;
    let quizzesDaApi=quizzesDisponiveis[0];
    let quizzesDisponiveisNaoUsuario=quizzesDisponiveis[0];
    quizzesDoUsuario=[];
    // let idsTodosQuizzes=todosQuizzes.map(elemento=>elemento.id);
    idsDeserializados=[];
    let quizzesDeserializados=[];
    if(verificarIdSalvos()){
        idsDeserializados=JSON.parse(localStorage.getItem("idsSalvos"));
        console.log(idsDeserializados);
        for (let i=0;i<idsDeserializados.length;i++){
            // idsTodosQuizzes=idsTodosQuizzes.filter(elemento=>elemento!==idsDeserializados[i]);
            quizzesDaApi=quizzesDaApi.filter(elemento=>elemento.id!==idsDeserializados[i]);
            quizzesDoUsuario[i]=(quizzesDisponiveisNaoUsuario.filter(elemento=>elemento.id===idsDeserializados[i]));
        
            if(quizzesDoUsuario[i].length===0){
                quizzesDeserializados=JSON.parse(localStorage.getItem("quizzsSalvos"));
                quizzesDoUsuario[i]=quizzesDeserializados[i];
                
            }
        }
        console.log(quizzesDoUsuario);
        document.getElementById("quizzes-usuarios").innerHTML=
        `<div class="cabeçalho-seus-quizzes">
        <h4>Seus Quizzes</h4>
        <ion-icon name="add-circle" onclick="criarQuizz()"></ion-icon>
        </div>`;
        document.getElementById("quizzes-usuarios").innerHTML+=`<div class="quizzes-usuarios-div"></div>`;
        //console.log("quizzes do usuiro", quizzesDoUsuario[0])
        for(let i=0;i<quizzesDoUsuario.length;i++){
            console.log(`${i+1}-quizz`,quizzesDoUsuario[i][0]);
            document.querySelector(".quizzes-usuarios-div").innerHTML+=
                `<div class="quizz" id="${idsDeserializados[i][0]}" onclick="abrirPaginaQuizz(this)">
                    <img src="${quizzesDoUsuario[i][0].image}" alt="Imagem ilustrativa do quizz">
                    <div class="efeito-gradiente">
                        <h3>${quizzesDoUsuario[i][0].title}</h3>
                    </div>
                </div>`
        }
        for (let j=0;j<quizzesDaApi.length;j++){
            elementoQuizzes.innerHTML+=
            `<div class="quizz" id="${quizzesDaApi[j].id}" onclick="abrirPaginaQuizz(this)">
                <img src="${quizzesDaApi[j].image}" alt="Imagem ilustrativa do quizz">
                <div class="efeito-gradiente">
                    <h3>${quizzesDaApi[j].title}</h3>
                </div>
            </div>`
        }
    }else{
        document.getElementById("quizzes-usuarios").innerHTML=
        `<div class="quizzes-em-branco">
        <h3>Você não criou nenhum quizz ainda :(</h3>
        <button onclick="criarQuizz()"><h2>Criar quizz</h2></button>
        </div>`;
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
}
function tratarErroCarregarQuizzes(erro){
    alert(`Erro ao carregar os quizzes existentes: Erro número ${erro.response.status}`);
    recarregarPagina();
}
function abrirPaginaQuizz(elemento){
    const ID_DO_QUIZZ=(elemento.id);

    if(verificarIdSalvos()){
        quizzesDeserializados=JSON.parse(localStorage.getItem("quizzsSalvos"));
        console.log(quizzesDeserializados);
        let quizElementoClicado;
        let idNumerico=Number(ID_DO_QUIZZ);
        for (let i=0;i<idsDeserializados.length;i++){
            console.log(idsDeserializados[i]);
            if(idsDeserializados[i]===idNumerico){ 
                quizElementoClicado=quizzesDeserializados[i];
                console.log(quizElementoClicado);
                habilitarQuizz();
                return exibirQuizz(quizElementoClicado);
            }
        }
        
        console.log(quizElementoClicado);
        
    }
    const promise=axios.get(`${APPI_URL}/${ID_DO_QUIZZ}`);
    promise.then(renderizarQuizz);
    promise.catch(tratarErroAbrirQuizz);
}
function habilitarQuizz(){
    document.querySelector(".tela-inicial").classList.add("escondido");
    document.querySelector(".tela-quiz").classList.remove("escondido");
    document.querySelector("header").scrollIntoView();
}
function renderizarQuizz(resposta){
    habilitarQuizz();
    console.log(resposta.data);
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
    dadosQuizz=quizz;
    console.log("esse é o quiz", quizz)
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
     let scoreMaximoObtido=0;
    for (let i = 0; i< dadosQuizz.levels.length; i++){
        if(score >= dadosQuizz.levels[i].minValue && dadosQuizz.levels[i].minValue>=scoreMaximoObtido){
            level=i;
            scoreMaximoObtido=dadosQuizz.levels[i].minValue;
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
        <button class = "refazer-quizz" onclick ="zerarQuizz()">Reiniciar Quizz</button>
        <button class = "voltar-home" onclick = "recarregarPagina()">Voltar pra home</button>
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
function verificarDadosIniciais(){
    quizzUsuario.title=document.getElementById("titulo").value;
    quizzUsuario.image=document.getElementById("url").value;
    numDePerguntas=document.getElementById("perguntas").value;
    numeroDeNiveis=document.getElementById("niveisquizz").value;
    document.getElementById("titulo").value="";
    document.getElementById("url").value="";
    document.getElementById("perguntas").value="";
    document.getElementById("niveisquizz").value="";
    if(isValidTitle(quizzUsuario.title)){
        return alert("Título inserido é inválido! Digite um titulo com no mínimo 20 caracteres e no máximo 65 caracteres");
    }
    if((!isValidURL(quizzUsuario.image))){ 
        return alert("URL inserida é inválida! Digite uma URL válida!");
    }
    if(!isImgLink(quizzUsuario.image)){
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
    <form class="forms-perguntas-niveis" id="forms-pergunta-1" action="/" method="get"></form>`;
    document.getElementById("forms-pergunta-1").innerHTML=renderizarForumlarioPerguntas(1);
    for(let i=1;i<numDePerguntas;i++){
        document.querySelector(".tela-de-gerar-perguntas").innerHTML+=`
        <form class="forms-clicavel" id="forms-pergunta-${i+1}" onclick="expandirFormularioPerguntas(this)" action="/" method="get">
            <h4>Pergunta ${i+1}</h4>
            <ion-icon  class="icone-editar" name="create-outline"></ion-icon>
        </form>`;
    }
    document.querySelector(".tela-de-gerar-perguntas").innerHTML+=`<button class="criar-niveis" onclick="verificarPerguntas()">Prosseguir pra criar níveis</button>`;
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
function expandirFormularioPerguntas(elemento){
    const id=elemento.id;
    const numId=Number(id.replace("forms-pergunta-",""));
    document.getElementById(id).classList.remove("forms-clicavel");
    document.getElementById(id).classList.add("forms-perguntas-niveis");
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
            return alert(`"Preencha ${numRespostasIncorretasPreenchidas[i]} URL das imagens das respostas incorretas da pergunta ${i+1}"`);
        }
    }
    if(elementosURLImagensPreenchidos.length!==elementosURLImagensValidas.length){
        return alert("URL inserida é inválida! Digite uma URL de uma imagem!");
    }
    armazenarQuestoesQuizz(elementosTextoPergunta,respostasCertasPreenchidas,elementosURLImagensRespostasCorretasPreenchidos);
    criarNiveis();
}
function verificarRespostasIncorretasVazias(numero){
    const respostasIncorretas=document.getElementById(`forms-pergunta-${numero}`).querySelectorAll("[name='resposta-incorreta']");
    numRespostasIncorretasPreenchidas[numero-1]=(Array.from(respostasIncorretas).filter(element=>element.value!=="").length);
    if(numRespostasIncorretasPreenchidas[numero-1]===0){
        return false;
    }
    return true;
}
function verificarURLvazias(numero){
    const urls=document.getElementById(`forms-pergunta-${numero}`).querySelectorAll("[name='url-img']");
    const urlsPreenchidas=Array.from(urls).filter(element=>element.value!=="");
    if(urlsPreenchidas.length===0){
        return false;
    }else if(urlsPreenchidas.length===numRespostasIncorretasPreenchidas[numero-1]){
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
        <input autocomplete="on" type="text" id="texto-da-pergunta" name="texto-da-pergunta" placeholder="Texto da pergunta">
        <input autocomplete="on" type="text" id="cor-de-fundo" name="cor-de-fundo" placeholder="Cor de fundo da pergunta">
      </div>
      <h4>Resposta correta</h4>
      <div> 
        <input autocomplete="on" type="text" id="resposta-correta" name="resposta-correta" placeholder="Resposta correta">
        <input autocomplete="on" type="text" class="url" id="url-img-correta" name="url-resposta-correta" placeholder="URL da imagem">
      </div>
      <h4>Respostas incorretas</h4>
      <div>
        <input autocomplete="on" type="text" id="resposta-incorreta-1" name="resposta-incorreta" placeholder="Resposta incorreta 1">
        <input autocomplete="on" type="text" class="url" id="url-img-1" name="url-img" placeholder="URL da imagem 1">
     </div>
     <div>
        <input autocomplete="on" type="text" id="resposta-incorreta-2" name="resposta-incorreta" placeholder="Resposta incorreta 2">
        <input autocomplete="on" type="text" class="url" id="url-img-2" name="url-img" placeholder="URL da imagem 2">
     </div>
     <div>
        <input autocomplete="on" type="text" id="resposta-incorreta-3" name="resposta-incorreta" placeholder="Resposta incorreta 3">
        <input autocomplete="on" type="text" class="url" id="url-img-3" name="url-img" placeholder="URL da imagem 3">
     </div>`);
}
function armazenarQuestoesQuizz(elementosPerguntas,elementosrRepostasCertas,elementosUrlCorretas){
    const textosDasPerguntas=Array.from(elementosPerguntas).map(elemento=>elemento.value);

    const elementosCorDaPergunta=document.querySelectorAll("[name='cor-de-fundo']");
    const coresDasPerguntas=Array.from(elementosCorDaPergunta).map(elemento=>elemento.value);

    const textosRespostasCertas=Array.from(elementosrRepostasCertas).map(elemento=>elemento.value);

    const urlRespostasCorretas=Array.from(elementosUrlCorretas).map(elemento=>elemento.value);

    const elementosRespostasIncorretas=[];
    const respostasIncorretasPreenchidas=[];
    const elementosUrlImagensIncorretas=[];
    const urlImagensIncorretas=[];
    for(let i=0;i<numDePerguntas;i++){
        elementosRespostasIncorretas[i]=document.getElementById(`forms-pergunta-${i+1}`).querySelectorAll("[name='resposta-incorreta']");
        respostasIncorretasPreenchidas[i]=(Array.from(elementosRespostasIncorretas[i]).map(elemento=>elemento.value).filter(element=>element!==""));
        elementosUrlImagensIncorretas[i]=document.getElementById(`forms-pergunta-${i+1}`).querySelectorAll("[name='url-img']");
        urlImagensIncorretas[i]=Array.from(elementosUrlImagensIncorretas[i]).map(elemento=>elemento.value).filter(element=>element!=="");
    }
    let resposta={
        text: "",
		image: "",
        isCorrectAnswer: null
    }
    let novoObjresposta={
        text: "",
		image: "",
        isCorrectAnswer: null
    }
    let respostas=[];
    const questao={
        title: "",
        color: "",
        answers: []
    }
    let novoObjetoquestao={
        title: "",
        color: "",
        answers: []
    }
    const questoes=[];
    let contador=0;
    for (let i=0;i<numDePerguntas;i++){
        novoObjresposta={
            text: "",
            image: "",
            isCorrectAnswer: null
        }
        respostas.push(Object.assign(novoObjresposta,resposta));
        respostas[contador].text=textosRespostasCertas[i];
        respostas[contador].image=urlRespostasCorretas[i];
        respostas[contador].isCorrectAnswer=true;
        for (let j=0;j<numRespostasIncorretasPreenchidas[i];j++){
            contador++;
            resposta={
                text: "",
                image: "",
                isCorrectAnswer: null
            }
            respostas.push(Object.assign(resposta,novoObjresposta));
            respostas[contador].text=respostasIncorretasPreenchidas[i][j];
            respostas[contador].image=urlImagensIncorretas[i][j];
            respostas[contador].isCorrectAnswer=false;
        }
        novoObjetoquestao={
            title: "",
            color: "",
            answers: []
        };
        questoes.push(Object.assign(novoObjetoquestao,questao));
        questoes[i].title=textosDasPerguntas[i];
        questoes[i].color=coresDasPerguntas[i];
        questoes[i].answers=respostas;
        respostas=[];
        contador=0;
    }
    quizzUsuario.questions=questoes;
}
function criarNiveis(){
    document.querySelector(".tela-de-gerar-perguntas").innerHTML="";
    document.querySelector(".tela-de-gerar-perguntas").classList.add("escondido");
    document.querySelector(".tela-de-gerar-niveis").classList.remove("escondido");
    document.querySelector(".tela-de-gerar-niveis").innerHTML=`
    <h3>Agora, decida os níveis</h3>
    <form class="forms-perguntas-niveis" id="forms-nivel-1" action="/" method="get"></form>`;
    document.getElementById("forms-nivel-1").innerHTML=renderizarForumlarioNiveis(1);
    for(let i=1;i<numeroDeNiveis;i++){
        document.querySelector(".tela-de-gerar-niveis").innerHTML+=`
        <form class="forms-clicavel" id="forms-nivel-${i+1}" onclick="expandirFormularioNiveis(this)" action="/" method="get">
            <h4>Nivel ${i+1}</h4>
            <ion-icon  class="icone-editar" name="create-outline"></ion-icon>
        </form>`;
    }
    document.querySelector(".tela-de-gerar-niveis").innerHTML+=`<button class="finalizar-quizz" onclick="verificarNiveis()">Finalizar Quizz</button>`;
}
function renderizarForumlarioNiveis(numero){
    return(`
<h4>Nivel ${numero}</h4>
<div>
  <input autocomplete="on" type="text" id="texto-do-nivel-${numero}" name="texto-nivel" placeholder="Título do nível">
  <input autocomplete="on" type="text" id="%-acerto-minima-${numero}" name="%-de-acerto" placeholder="% de acerto mínima">
  <input autocomplete="on" type="text" id="url-nivel-${numero}" name="url-nivel" placeholder="URL da imagem do nível">
  <textarea wrap="soft" autocomplete="on" type="text" id="descricao-nivel-${numero}" name="descricao-nivel" placeholder="Descrição do nível"cols="30" rows="10"></textarea>
</div>`);
}
function expandirFormularioNiveis(elemento){
    const id=elemento.id;
    const numId=Number(id.replace("forms-nivel-",""));
    document.getElementById(id).classList.remove("forms-clicavel");
    document.getElementById(id).classList.add("forms-perguntas-niveis");
    document.getElementById(id).innerHTML="";
    document.getElementById(id).innerHTML=renderizarForumlarioNiveis(numId);
    elemento.removeAttribute("onclick");
}
function verificarNiveis(){
    const formsClicaveis=document.querySelector(".tela-de-gerar-niveis").querySelectorAll(".forms-clicavel");

    const elementosInput=document.querySelectorAll(".tela-de-gerar-niveis input");
    const inputsVazios=Array.from(elementosInput).filter(elemento=>elemento.value==="");

    const elementosTitulosNiveis=document.querySelector(".tela-de-gerar-niveis").querySelectorAll("[name='texto-nivel']");
    const TitulosNiveisCorretos=Array.from(elementosTitulosNiveis).map(elemento=>elemento.value).filter(elemento=>elemento.length>=10);

    const elementosPorcentagensMinimas=document.querySelector(".tela-de-gerar-niveis").querySelectorAll("[name='%-de-acerto']");
    const PorcentagensMinimas=Array.from(elementosPorcentagensMinimas).map(elemento=>elemento.value).filter(elemento=> !isNaN(Number(elemento)));
    const PorcentagemMinimaZero=PorcentagensMinimas.filter(elemento=>Number(elemento)===0);

    const elementosUrlsNiveis=document.querySelector(".tela-de-gerar-niveis").querySelectorAll("[name='url-nivel']");
    const urlsNiveisValidos=Array.from(elementosUrlsNiveis).map(elemento=>elemento.value).filter(isValidURL).filter(isImgLink);

    const elementosDescricoesNiveis=document.querySelector(".tela-de-gerar-niveis").querySelectorAll("[name='descricao-nivel']");
    const textsAreas=Array.from(elementosDescricoesNiveis).map(elemento=>elemento.value).filter(elemento=>elemento.length>=30);

    if(formsClicaveis.length!==0){
        return alert("Preencha todos os niveis disponíveis!");
    }
    if(inputsVazios.length!==0){
        return alert("Preenche todos os campos de input disponíveis!");
    }
    if(TitulosNiveisCorretos.length!==elementosTitulosNiveis.length){
        return alert("Título inválido! Digite um título do nível com no mínimo 10 caracteres");
    }
    if(PorcentagensMinimas.length!==elementosPorcentagensMinimas.length){
        return alert("Porcentagem de acerto inválida! Digite um número de 0 a 100");
    }
    if(PorcentagemMinimaZero.length===0){
        return alert("Porcentagem de acerto inválida! Digite pelo menos uma porcentagem igual a 0%");
    }
    if(elementosUrlsNiveis.length!==urlsNiveisValidos.length){
        return alert("URL inserida é inválida! Preencha uma URL de uma imagem válida!");
    }
    if(elementosDescricoesNiveis.length!==textsAreas.length){
        return alert("Descrição do nível inválida! Digite uma descrição com no mínimo 30 caracteres");
    }
    armazenarNiveisQuizz(TitulosNiveisCorretos,urlsNiveisValidos,PorcentagensMinimas,textsAreas);
}
function armazenarNiveisQuizz(titulos,urls,stringNumbers,textos){
    let nivel={
        title:"",
        image:"",
        text:"",
        minValue:0
    };
    let novoObjnivel={
        title:"",
        image:"",
        text:"",
        minValue:0
    }
    const niveis=[];
    for(let i=0;i<numeroDeNiveis;i++){
        novoObjnivel={
            title:"",
            image:"",
            text:"",
            minValue:0
        }
        niveis.push(Object.assign(novoObjnivel,nivel));
        niveis[i].title=titulos[i];
        niveis[i].image=urls[i];
        niveis[i].text=textos[i];
        niveis[i].minValue=Number(stringNumbers[i]);
    }
    quizzUsuario.levels=niveis;
    enviarQuizzParaAPI();
}

function enviarQuizzParaAPI(){
    const promise = axios.post(APPI_URL, quizzUsuario);
    promise.then(renderizarPaginaSucessoQuizz);
    promise.catch(tratarErroEnvioQuizz);
}

function tratarErroEnvioQuizz (erro){
    alert("Erro ao enviar o quizz para o servidor: ", erro.response.data)
}
function renderizarPaginaSucessoQuizz(resposta){
    ID_QUIZZ_USUARIO=resposta.data.id;
    salvarIdNoNavegador(ID_QUIZZ_USUARIO);
    salvarQuizzNoNavegador(quizzUsuario);
    document.querySelector(".tela-de-gerar-niveis").classList.add("escondido");
    document.querySelector(".tela-de-sucesso-quizz").classList.remove("escondido");
    document.querySelector(".tela-de-sucesso-quizz").innerHTML=
    `<h3>Seu quizz está pronto!</h3>
    <div class="finalizacao-quizz-usuario">
        <img src="${quizzUsuario.image}" alt="Imagem ilustrativa do quizz">
        <div class="efeito-gradiente-sucesso-quizz">
            <h3>${quizzUsuario.title}</h3>
        </div>
    </div>
    <button class = "acessar-quizz" onclick ="abrirQuizzUsuario()">Reiniciar Quizz</button>
    <button class = "voltar-home-sucesso-quiz" onclick = "recarregarPagina()">Voltar pra home</button>`;
}
function abrirQuizzUsuario(){
    document.querySelector(".tela-de-sucesso-quizz").classList.add("escondido");
    document.querySelector(".tela-quiz").classList.remove("escondido");
    document.querySelector("header").scrollIntoView();
    exibirQuizz(quizzUsuario);
}
function salvarIdNoNavegador (id){
    idsDeserializados=[];
    let idsSerializados=[];
    if(verificarIdSalvos()){
        idsDeserializados=JSON.parse(localStorage.getItem("idsSalvos"));
        idsDeserializados.push(id);
        idsSerializados=JSON.stringify(idsDeserializados);
        localStorage.setItem("idsSalvos",idsSerializados);
    }else{
        idsDeserializados.push(id);
        idsSerializados=JSON.stringify(idsDeserializados);
        localStorage.setItem("idsSalvos",idsSerializados);
    }
}
function salvarQuizzNoNavegador (quizz){
    let quizzsDeserializados=[];
    let quizzsSerializados=[];
    if(verificarQuizzSalvos()){
        console.log("ENTREI");
        quizzsDeserializados=JSON.parse(localStorage.getItem("quizzsSalvos"));
        quizzsDeserializados.push(quizz);
        quizzsSerializados=JSON.stringify(quizzsDeserializados);
        localStorage.setItem("quizzsSalvos",quizzsSerializados);
    }else{
        quizzsDeserializados.push(quizz);
        quizzsSerializados=JSON.stringify(quizzsDeserializados);
        localStorage.setItem("quizzsSalvos",quizzsSerializados);
    }
}


function verificarIdSalvos(){
    const idsSerializados= localStorage.getItem("idsSalvos");
    const idsDeserializados=JSON.parse(idsSerializados);
    return Boolean(idsDeserializados);
   
}
function verificarQuizzSalvos(){
    const quizzsSerializados= localStorage.getItem("quizzsSalvos");
    console.log(quizzsSerializados);
    const quizzsDeserializados=JSON.parse(quizzsSerializados);
    return (Boolean(quizzsDeserializados));
}
//salvarIdNoNavegador(1);
// const qz=[{

//     "title": "Quizz só pra quem sabe de MAMACOS",
//     "image": "https://sm.ign.com/ign_br/screenshot/default/naruto-shippuden_f134.png",
//     "questions": [
//         {
//             "title": "asgasgsaasgasgasgasgg",
//             "color": "#aaaaaa",
//             "answers": [
//                 {
//                     "text": "afasfasfasfassfasfas",
//                     "image": "http://127.0.0.1:5500/",
//                     "isCorrectAnswer": true
//                 },
//                 {
//                     "text": "afasfasfasfassfasfas",
//                     "image": "http://127.0.0.1:5500/",
//                     "isCorrectAnswer": false
//                 }
//             ]
//         },
//         {
//             "title": "asgasgsaasgasgasgasgg",
//             "color": "#aaaaaa",
//             "answers": [
//                 {
//                     "text": "afasfasfasfassfasfas",
//                     "image": "http://127.0.0.1:5500/",
//                     "isCorrectAnswer": true
//                 },
//                 {
//                     "text": "afasfasfasfassfasfas",
//                     "image": "http://127.0.0.1:5500/",
//                     "isCorrectAnswer": false
//                 }
//             ]
//         },
//         {
//             "title": "asgasgsaasgasgasgasgg",
//             "color": "#aaaaaa",
//             "answers": [
//                 {
//                     "text": "afasfasfasfassfasfas",
//                     "image": "http://127.0.0.1:5500/",
//                     "isCorrectAnswer": true
//                 },
//                 {
//                     "text": "afasfasfasfassfasfas",
//                     "image": "http://127.0.0.1:5500/",
//                     "isCorrectAnswer": false
//                 }
//             ]
//         }
//     ],
//     "levels": [
//         {
//             "title": "asdasdasdasasasdasd",
//             "image": "http://127.0.0.1:5500/",
//             "text": "23123123123123123123123123123123131",
//             "minValue": 0
//         },
//         {
//             "title": "asdasdasdasasasdasd",
//             "image": "http://127.0.0.1:5500/",
//             "text": "23123123123123123123123123123123131",
//             "minValue": 0
//         }
//     ]

// }];
// salvarQuizzNoNavegador (qz);