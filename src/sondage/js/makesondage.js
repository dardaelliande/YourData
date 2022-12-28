// Crée une div permettant de rentrer l'intitulé de la question
function createQuestionTitle() {
	const question = document.createElement('div');
	question.classList.add('columnBox');
  
	const label = document.createElement('label');
	label.innerText = 'Intitulé de la question :';
  
	const inputText = document.createElement('input');
	inputText.type = 'text';
	inputText.id = 'textTitleInput';
  
	question.appendChild(label);
	question.appendChild(inputText);

	return question;
  }
  
  // Crée une div permettant de choisir (par select) le type de la question (multiple, unique, textuelle)
  function createQuestionType() {
	const question = document.createElement('div');
	question.classList.add('columnBox');
  
	const label = document.createElement('label');
	label.innerText = 'Type de la question :';
  
	const choice = document.createElement('select');
	choice.id = 'selectedType';
  
	const optionMultiple = document.createElement('option');
	optionMultiple.value = 'multiple';
	optionMultiple.text = 'multiple';
  
	const optionUnique = document.createElement('option');
	optionUnique.value = 'unique';
	optionUnique.text = 'unique';
  
	const optionText = document.createElement('option');
	optionText.value = 'textuelle';
	optionText.text = 'textuelle';
  
	choice.appendChild(optionMultiple);
	choice.appendChild(optionUnique);
	choice.appendChild(optionText);
  
	// Lorsque le choix textuelle est fait, les options disparaissent, réapparaissent lorsqu'un autre mode est choisi.
	choice.addEventListener('change', function() {
	  const optionContainer = this.parentElement.parentElement.querySelector('#optionsContainer');
	  if (this.value === 'textuelle') {
		optionContainer.style.display = 'none';
	  } else {
		optionContainer.style.display = 'initial';
	  }
	});
  
	question.appendChild(label);
	question.appendChild(choice);

	return question;
  }
  
  // Crée une div dans laquelle sera stockée les options liées à la question
  function createBoxToAddOption() {
	const box = document.createElement('div');
	box.id = 'optionsContainer';
	box.classList.add('columnBox');
  
	return box;
  }
  
  // Crée un input de type texte
  function createInputText() {
	const input = document.createElement('input');
	input.type = 'text';

	return input;
  }
  
// Crée un input de type texte, en lui associant un label à l'aide d'une div
function createInputTextWithLabel(string) {
	const box = document.createElement('div');
	box.classList.add('columnBox');
  
	const label = document.createElement('label');
	label.innerText = `Option ${string + 1}`
	const input = createInputText();
  input.id = 'optionInput';

  box.appendChild(label);
  box.appendChild(input);

  return box;
}

// Crée un bouton permettant d'ajouter une option à la question
function createButtonAddOption() {
  const button = document.createElement('button');
  button.innerText = "Ajout d'une option";

  // Lorsque le bouton est cliqué, il ajoute un input de type texte avec label dans le contenaire des options
  button.addEventListener('click', function(event) {
    event.preventDefault();

    const optionsBox = this.parentElement.querySelector('#optionsContainer');
    const wichOption = optionsBox.childElementCount;

    optionsBox.appendChild(createInputTextWithLabel(wichOption));
  });

  return button;
}

// Crée tous les éléments de la page
function createElements() {
  const mainElement = document.getElementById('form');

  const questionElement = document.createElement('div');

  questionElement.appendChild(createQuestionTitle());
  questionElement.appendChild(createQuestionType());
  questionElement.appendChild(createBoxToAddOption());
  questionElement.appendChild(createButtonAddOption());

  mainElement.appendChild(questionElement);
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

// Lorsque le bouton est cliqué, il ajoute un input de type texte avec label dans le contenaire des options
document.getElementById('addQuestion').addEventListener('click', function(event) {
  event.preventDefault();
  createElements();
});

document.getElementById('submit').addEventListener('click', function(event) {
  event.preventDefault();
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

createElements();
