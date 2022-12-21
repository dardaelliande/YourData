let questionTypes = ['unique', 'multiple', 'text'];

function createQuestionTitle(){
    var question = document.createElement('div');
    question.classList.add('columnBox');

    var label = document.createElement('label');
    label.innerText='Intitulé de la question :';

    var inputText = document.createElement('input');
    inputText.type= 'text';
    inputText.id = 'textTitleInput';

    question.appendChild(label);
    question.appendChild(inputText);
    return question;
}

function createQuestionType(){
    var question = document.createElement('div');
    question.classList.add('columnBox');

    var label = document.createElement('label');
    label.innerText='Type de la question :';

    var choice = document.createElement('select');
    choice.id='selectedType';

    var optionMultiple = document.createElement('option');
    optionMultiple.value='multiple';
    optionMultiple.text='multiple';
    

    var optionUnique = document.createElement('option');
    optionUnique.value='unique';
    optionUnique.text='unique';

    var optionText = document.createElement('option');
    optionText.value='textuelle';
    optionText.text='textuelle';


    choice.appendChild(optionMultiple);
    choice.appendChild(optionUnique);
    choice.appendChild(optionText);

    choice.addEventListener('change',function(){
        var optionContainer = this.parentElement.parentElement.querySelector('#optionsContainer');
        if(this.value=='textuelle'){
            optionContainer.style.display = "none";
        }
        else{
            optionContainer.style.display = "initial";
        }
    })

    question.appendChild(label);
    question.appendChild(choice);
    return question;
}

function createBoxToAddOption(){
    var box = document.createElement('div');
    box.id='optionsContainer';
    box.classList.add('columnBox');

    return box;
}

function createInputText(){
    var input=document.createElement('input');
    input.type='text';
    return input;
}

function createInputTextWithLabel(string){

    var box = document.createElement('div');
    box.classList.add('columnBox');

    var label = document.createElement('label');
    label.innerText='Option '+ (string+1);
    var input=document.createElement('input');
    input.id='optionInput';
    input.type='text';

    box.appendChild(label);
    box.appendChild(input);

    return box;
}

function createButtonAddOption(){
    var button = document.createElement('button');
    button.innerText='Ajout d\'une option';

    button.addEventListener('click', function(event){
        event.preventDefault();
        
        let parentElement = this.parentElement;
        let optionsBox = parentElement.querySelector('#optionsContainer');
        let wichOption = optionsBox.childElementCount;

        optionsBox.appendChild(createInputTextWithLabel(wichOption));
    });
    return button;
}

function addQuestion(){

    var newQuestion = document.createElement('div');
    newQuestion.classList.add('questionContainer');

    newQuestion.appendChild(createQuestionTitle());
    newQuestion.appendChild(createQuestionType());
    newQuestion.appendChild(createBoxToAddOption());
    newQuestion.appendChild(createButtonAddOption());
    return newQuestion;   
}

function sendSurveyToDataBase(survey){
    const postRequest = new XMLHttpRequest();
    postRequest.open('POST', '../database/survey.php');
    postRequest.setRequestHeader('Content-Type', 'application/json');
  
    // Traitez la réponse du script serveur
    postRequest.onload = function() {       
      if (postRequest.status == 200) {
        //console.log(postRequest.responseText);
      }
    };
  
    // Envoyez la requête avec les données préparées
    postRequest.send(JSON.stringify(survey));
    console.log(JSON.stringify(survey));

    
}

// Envoyez une requête HTTP GET au script serveur
const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/companies.php');
xhr.send();

// Traitez la réponse du script serveur
xhr.onload = function() {
  if (xhr.status == 200) {
    // Traitez les données de la réponse ici;
    const data = JSON.parse(xhr.responseText);
    const dataList = document.getElementById('companyList');
    data.forEach(element => {
        var option = document.createElement('option');
        option.value = element['name'];
        dataList.appendChild(option);
    });

  }
};

document.getElementById('addQuestion').addEventListener('click', function() {
	// Créez un nouvel élément de formulaire pour la question suivante
	var newQuestion = addQuestion();

    // Ajoutez la question au formulaire
	document.getElementById('form').appendChild(newQuestion);

    
});

document.getElementById('submit').addEventListener('click', function() {
    //Crée la variable qui va stocker la version traitée du formulaire
    var surveyQuestions = [];

	// Récupere le fomulaire 
    var form = document.querySelector('#form');
    var childrens = form.childNodes;

    childrens.forEach(element => {
        if (element.nodeType === Node.ELEMENT_NODE) {
            var question;
        var questionType = element.querySelector('#selectedType').value;
        switch (questionType){
            case 'multiple' :
                var questionTitle = element.querySelector('#textTitleInput').value;
                choicesContainer = element.querySelector('#optionsContainer').childNodes;
                var choicesList = [];
                choicesContainer.forEach(element => {
                    choicesList.push(element.childNodes[1].value)
                });
                question = {
                    type : questionType,
                    question : questionTitle,
                    choices : choicesList
                };
                break;

            case 'unique' :
                var questionTitle = element.querySelector('#textTitleInput').value;
                choicesContainer = element.querySelector('#optionsContainer').childNodes;
                var choicesList = [];
                choicesContainer.forEach(element => {
                    choicesList.push(element.childNodes[1].value)
                });
                question = {
                    type : questionType,
                    question : questionTitle,
                    choices : choicesList
                };
                break;

            case 'textuelle' :
                var questionTitle = element.querySelector('#textTitleInput').value;
                question = {
                    type : questionType,
                    question : questionTitle
                };
                break;
        }
        surveyQuestions.push(question);
        }
        
    });

    var survey ={
        name        : document.querySelector('#surveyName').value,
        company     : document.querySelector('#companyName').value,
        questions   : surveyQuestions
    };

    sendSurveyToDataBase(survey)	
});
