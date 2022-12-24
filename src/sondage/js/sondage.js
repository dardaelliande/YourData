function createQuestionElement(question) {
	// Crée la div qui contiendra l'intitulé de la question ainsi que les réponses possibles
	const questionContainer = document.createElement('div');
	questionContainer.id = question.id;
	questionContainer.classList.add('question-container');
	// Ajoute la question à la div
	const questionElement = document.createElement('p');
	questionElement.innerText = question.question;
	questionContainer.appendChild(questionElement);
	// Ajoute les réponses possibles, traitées selon leur type
	if (question.type === 'multiple' || question.type === 'unique') {
		for (let i = 0; i < question.choices.length; i++) {
			const choice = question.choices[i];
			const choiceContainer = document.createElement('div');
			choiceContainer.classList.add('choice-container');
			// Crée un élément input selon le type de question
			const inputElement = createInputElement(question, choice);
			choiceContainer.appendChild(inputElement);
			// Ajoute le texte de la réponse à côté de l'input
			const choiceText = document.createElement('span');
			choiceText.innerText = choice;
			choiceContainer.appendChild(choiceText);
			questionContainer.appendChild(choiceContainer);
		}
	} else if (question.type === 'textuelle') {
		const choiceContainer = document.createElement('div');
		choiceContainer.classList.add('choice-container');
		// Crée un élément input de type texte pour les questions textuelles
		const inputElement = createInputElement(question);
		choiceContainer.appendChild(inputElement);
		questionContainer.appendChild(choiceContainer);
	}
	// Retourne l'élément div créé
	return questionContainer;
}

// Permet de créer l'élément HTML d'un input selon le type de question
function createInputElement(question, choice) {
	// Crée un élément input selon le type de question
	const inputElement = document.createElement('input');
	inputElement.name = question.question;
	if (question.type === 'multiple') {
		inputElement.type = 'checkbox';
		inputElement.value = choice;
	} else if (question.type === 'unique') {
		inputElement.type = 'radio';
		inputElement.value = choice;
	} else if (question.type === 'textuelle') {
		inputElement.type = 'text';
		inputElement.classList.add('inputField');
	}
	// Retourne l'élément input créé
	return inputElement;
}

// Permet d'afficher le sondage donné
function displaySurvey(survey) {
	// Récupère la div dans laquelle on va venir insérer le sondage #survey
	const surveyContainer = document.querySelector('#survey');
	// Parcours les questions de l'objet survey
	for (let i = 0; i < survey.questions.length; i++) {
		const question = survey.questions[i];
		// Crée l'élément HTML de la question
		const questionElement = createQuestionElement(question);
		// Ajoute l'élément au DOM
		surveyContainer.appendChild(questionElement);
	}

	// Crée le bouton submit
	const submitButton = document.createElement('button');
	submitButton.innerText = 'Envoyer';

	// Lorsque le bouton submit est clické, il récupère les valeurs choisies et les transforme en objet
	submitButton.addEventListener('click', function() {
		const survey = document.querySelector('#survey');
		const questions = survey.querySelectorAll('.question-container');
		const answers = {};
		for (let i = 0; i < questions.length; i++) {
			const question = questions[i];
			const questionId = question.id;
			const questionType = question.dataset.type;
			let questionAnswer;
			if (questionType === 'multiple' || questionType === 'unique') {
				const choices = question.querySelectorAll('input[type=checkbox], input[type=radio]');
				questionAnswer = [];
				for (let j = 0; j < choices.length; j++) {
					const choice = choices[j];
					if (choice.checked) {
						questionAnswer.push(choice.value);
					}
				}
			} else if (questionType === 'textuelle') {
				const inputField = question.querySelector('.inputField');
				questionAnswer = inputField.value;
			}
			// Vérifie que la réponse est bien de type attendu avant de l'ajouter à l'objet answers
			if (Array.isArray(questionAnswer)) {
				answers[questionId] = questionAnswer.filter(choice => typeof choice === 'string');
			} else if (typeof questionAnswer === 'string') {
				answers[questionId] = questionAnswer;
			}
		}
		console.log(answers);
		// Envoie les réponses à la base de données via une requête POST
		sendResponsesToDatabase(answers);
	});

	// Ajoute le bouton submit au DOM
	surveyContainer.appendChild(submitButton);
}