//Crée une div permettant de rentrer l'intitulé de la question
function createQuestionTitle() {
	var question = document.createElement('div');
	question.classList.add('columnBox');

	var label = document.createElement('label');
	label.innerText = 'Intitulé de la question :';

	var inputText = document.createElement('input');
	inputText.type = 'text';
	inputText.id = 'textTitleInput';

	question.appendChild(label);
	question.appendChild(inputText);
	return question;
}

//Crée une div permettant de choisir (par radio) le type de la question (multiple, unique, textuelle)
function createQuestionType() {
	var question = document.createElement('div');
	question.classList.add('columnBox');

	var label = document.createElement('label');
	label.innerText = 'Type de la question :';

	var choice = document.createElement('select');
	choice.id = 'selectedType';

	var optionMultiple = document.createElement('option');
	optionMultiple.value = 'multiple';
	optionMultiple.text = 'multiple';


	var optionUnique = document.createElement('option');
	optionUnique.value = 'unique';
	optionUnique.text = 'unique';

	var optionText = document.createElement('option');
	optionText.value = 'textuelle';
	optionText.text = 'textuelle';


	choice.appendChild(optionMultiple);
	choice.appendChild(optionUnique);
	choice.appendChild(optionText);

	//Lorsque le choix textuelle est fait, les options disparaissent, réaparaissent lorsqu'un autre mode est choisit.
	choice.addEventListener('change', function() {
		var optionContainer = this.parentElement.parentElement.querySelector('#optionsContainer');
		if (this.value == 'textuelle') {
			optionContainer.style.display = "none";
		} else {
			optionContainer.style.display = "initial";
		}
	})

	question.appendChild(label);
	question.appendChild(choice);
	return question;
}

//Crée une div dans laquelle sera stockée les options liées à la question
function createBoxToAddOption() {
	var box = document.createElement('div');
	box.id = 'optionsContainer';
	box.classList.add('columnBox');

	return box;
}

//Crée un input de type texte
function createInputText() {
	var input = document.createElement('input');
	input.type = 'text';
	return input;
}

//Crée un input de type texte, en lui associant un label à l'aide d'une div
function createInputTextWithLabel(string) {
	var box = document.createElement('div');
	box.classList.add('columnBox');

	var label = document.createElement('label');
	label.innerText = 'Option ' + (string + 1);
	var input = createInputText();
	input.id = 'optionInput';

	box.appendChild(label);
	box.appendChild(input);

	return box;
}

//Crée un boutton permettant d'ajouter une option à la question
function createButtonAddOption() {
	var button = document.createElement('button');
	button.innerText = 'Ajout d\'une option';

	//Lorsque le boutton est clické, il va chercher le contenair des options présent dans l'élément parent, et y ajoute un input text avec label
	button.addEventListener('click', function(event) {
		event.preventDefault();

		let parentElement = this.parentElement;
		let optionsBox = parentElement.querySelector('#optionsContainer');
		let wichOption = optionsBox.childElementCount;

		optionsBox.appendChild(createInputTextWithLabel(wichOption));
	});
	return button;
}

//Permet d'ajouter une question, en mettant dans une div tout les éléments nécessaires
function addQuestion() {
	var newQuestion = document.createElement('div');
	newQuestion.classList.add('questionContainer');

	newQuestion.appendChild(createQuestionTitle());
	newQuestion.appendChild(createQuestionType());
	newQuestion.appendChild(createBoxToAddOption());
	newQuestion.appendChild(createButtonAddOption());
	return newQuestion;
}

//Permet d'envoyer à la base de données le formulaire une fois qu'il a été crée
function sendSurveyToDataBase(survey) {
	//Crée la requête POST lié au fichier survey.php
	const postRequest = new XMLHttpRequest();
	postRequest.open('POST', '../database/survey.php');
	postRequest.setRequestHeader('Content-Type', 'application/json');

	postRequest.onload = function() {
		if (postRequest.status == 200) {
			console.log(postRequest.responseText);
		}
	};

	//Envoie la requête avec le sondage sous forme textuelle
	postRequest.send(JSON.stringify(survey));
	console.log(JSON.stringify(survey));


}

//Permet de récupérer l'ensemble des entreprises actuellement dans la base de données
const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/companies.php');
xhr.send();

xhr.onload = function() {
	if (xhr.status == 200) {
		//On va ici rajouter les entreprises à la liste companyList, 
		//permettant d'aider à choisir l'entreprise qui réalise le sondage, elles seront proposées dans la barre de recherche
		const data = JSON.parse(xhr.responseText);
		const dataList = document.getElementById('companyList');
		data.forEach(element => {
			var option = document.createElement('option');
			option.value = element['name'];
			dataList.appendChild(option);
		});

	}
};

//Lie le boutton addQuestion à la fonction suivante permettant de rajouter une question dans le formulaire
document.getElementById('addQuestion').addEventListener('click', function() {
	// Créez un nouvel élément de formulaire pour la question suivante
	var newQuestion = addQuestion();

	// Ajoutez la question au formulaire
	document.getElementById('form').appendChild(newQuestion);


});

//Lorsque le boutton submit est clické, on va factoriser les choix réalisés dans le formulaire
//afin de les traiter des manière à créer une classe, que l'on enverra en JSON au fichier php
//survey.php qui le traitera
/*
    var survey ={
        name        : document.querySelector('#surveyName').value,
        company     : document.querySelector('#companyName').value,
        questions   : surveyQuestions
    };

    question = {
        type : questionType,
        question : questionTitle,
        choices : choicesList
    };
*/
document.getElementById('submit').addEventListener('click', function() {
	//Crée la variable qui va stocker la version traitée du formulaire
	var surveyQuestions = [];

	//Récupere le fomulaire 
	var form = document.querySelector('#form');
	var childrens = form.childNodes;

	childrens.forEach(element => {
		if (element.nodeType === Node.ELEMENT_NODE) {
			var question;
			var questionType = element.querySelector('#selectedType').value;
			switch (questionType) {
				case 'multiple':
					var questionTitle = element.querySelector('#textTitleInput').value;
					choicesContainer = element.querySelector('#optionsContainer').childNodes;
					var choicesList = [];
					choicesContainer.forEach(element => {
						choicesList.push(element.childNodes[1].value)
					});
					question = {
						type: questionType,
						question: questionTitle,
						choices: choicesList
					};
					break;

				case 'unique':
					var questionTitle = element.querySelector('#textTitleInput').value;
					choicesContainer = element.querySelector('#optionsContainer').childNodes;
					var choicesList = [];
					choicesContainer.forEach(element => {
						choicesList.push(element.childNodes[1].value)
					});
					question = {
						type: questionType,
						question: questionTitle,
						choices: choicesList
					};
					break;

				case 'textuelle':
					var questionTitle = element.querySelector('#textTitleInput').value;
					question = {
						type: questionType,
						question: questionTitle
					};
					break;
			}
			surveyQuestions.push(question);
		}

	});

	var survey = {
		name: document.querySelector('#surveyName').value,
		company: document.querySelector('#companyName').value,
		questions: surveyQuestions
	};

	sendSurveyToDataBase(survey)
});