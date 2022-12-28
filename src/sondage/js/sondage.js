function sendResponsesToDataBase(answers) {
	console.log(answers);
	const postRequest = new XMLHttpRequest();
	postRequest.open('POST', '../database/user_responses.php');
	postRequest.setRequestHeader('Content-Type', 'application/json');

	// Traitez la réponse du script serveur
	postRequest.onload = function() {
		if (postRequest.status === 200) {
			console.log(postRequest.responseText);
		}
	};

	//On envoie l'objet answers sous forme textuelle
	postRequest.send(JSON.stringify(answers));
}

function createInputElement(question, choice) {
	const choiceContainer = document.createElement('div');
	choiceContainer.classList.add('choice-container');

	const inputElement = document.createElement('input');
	inputElement.type = (question.type === 'multiple') ? 'checkbox' : 'radio';
	inputElement.name = question.question;
	inputElement.value = choice;
	choiceContainer.appendChild(inputElement);

	const choiceText = document.createElement('span');
	choiceText.innerText = choice;
	choiceContainer.appendChild(choiceText);

	return choiceContainer;
}

function displaySurvey(survey) {
	//On récupère la div dans laquelle on va venir insérer le sondage #survey
	const surveyContainer = document.querySelector('#survey');
	survey.questions.forEach((question) => {
		//Pour chaque question, on crée une div qui contiendra l'intitulé de la question ainsi que les réponses possibles
		const questionContainer = document.createElement('div');
		questionContainer.id = question.id;
		questionContainer.classList.add('question-container');
		//On ajoute la question à la div
		const questionElement = document.createElement('p');
		questionElement.innerText = question.question;
		questionContainer.appendChild(questionElement);
		//On ajoute les réponses possible, traités selon leur type
		if (question.type === 'multiple' || question.type === 'unique') {
			question.choices.forEach((choice) => {
				questionContainer.appendChild(createInputElement(question, choice));
			});
		} else if (question.type === 'textuelle') {
			const choiceContainer = document.createElement('div');
			choiceContainer.classList.add('choice-container');
			// Créer un élément input de type texte pour les questions textuelles
			const inputElement = document.createElement('input');
			inputElement.type = 'text';
			inputElement.name = question.question;
			inputElement.classList.add('inputField');
			choiceContainer.appendChild(inputElement);
			questionContainer.appendChild(choiceContainer);
		}

		//On l'ajoute à la div #survey
		surveyContainer.appendChild(questionContainer);
	});

	//On crée maintenant le bouton submit
	const submitButton = document.createElement('button');
	submitButton.innerText = 'Envoyer';

	//Lorsque le bouton submit est clické, il va venir récupérer les valeurs choisies pour les transformer en objet
	submitButton.addEventListener('click', function() {
		const survey = document.getElementById('survey');
		const questionsContainer = survey.childNodes;
		const responses = [];
		//Boucle sur chaque enfant (div des questions) présentes dans #survey
		questionsContainer.forEach((question) => {
			const questionId = question.id;
			const answers = [];
			question.childNodes.forEach((element) => {
				if (element.nodeName === 'DIV') {
					element.childNodes.forEach((element) => {
						if (element.nodeName === 'INPUT') {
							if (element.type === 'text') {
								answers.push(element.value);
							} else if (element.checked) {
								answers.push(element.value);
							}
						}
					});
				}
			});
			//On enlève les questions qui peuvent avoir des problèmes de traitement
			if (questionId != undefined) {
				if (questionId != '') {
					responses.push({
						idQuestion: questionId,
						responses : answers,
						idSurvey  : urlParams.get('id')
					});
				}
			}
		});
		//On envoie les réponses à la base de données
		sendResponsesToDataBase(responses);
	});

	surveyContainer.appendChild(submitButton);
}

//On récupère via l'url de la page l'id du sondage
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const xhr = new XMLHttpRequest();
//On récupère via la méthode get et le paramètre id le sondage à afficher
xhr.open('GET', '../database/survey.php?id=' + id + '');
xhr.send();

//On affiche le sondage une fois qu'il a été chargé
xhr.onload = function() {
	if (xhr.status == 200) {
		const data = JSON.parse(xhr.responseText);
		displaySurvey(data);
	}
};