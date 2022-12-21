function displaySurvey(survey) {
const surveyContainer = document.querySelector('#survey');
survey['questions'].forEach((question) => {
  // Créer un élément div pour chaque question
  const questionContainer = document.createElement('div');
  questionContainer.classList.add('question-container');
  // Ajouter la question au div
  const questionElement = document.createElement('p');
  questionElement.innerText = question.question;
  questionContainer.appendChild(questionElement);
  // Ajouter les réponses possibles au div
  if (question.type === 'multiple' || question.type === 'unique') {
    question.choices.forEach((choice) => {
      const choiceContainer = document.createElement('div');
      choiceContainer.classList.add('choice-container');
      // Créer un élément input selon le type de question
      const inputElement = document.createElement('input');
      inputElement.type = (question.type == 'multiple') ? 'checkbox' : 'radio';
      inputElement.name = question.question;
      inputElement.value = choice;
      choiceContainer.appendChild(inputElement);
      // Ajouter le texte de la réponse à côté de l'input
      const choiceText = document.createElement('span');
      choiceText.innerText = choice;
      choiceContainer.appendChild(choiceText);
      questionContainer.appendChild(choiceContainer);
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

  


  // Ajouter le div de la question à la div principale du sondage
  surveyContainer.appendChild(questionContainer);
});

const submitButton = document.createElement('button');
  submitButton.innerText = 'Envoyer';
  submitButton.addEventListener('click', function() {
    const answers = {};

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
      if (input.checked) {
        // Si la question existe déjà dans l'objet answers, ajouter la réponse au tableau
        if (answers[input.name]) {
          answers[input.name].push(input.value);
        } else {
          // Sinon, créer un tableau avec la réponse
          answers[input.name] = [input.value];
        }
      } else if (input.type === 'text') {
        // Pour les questions textuelles, stocker la réponse comme une chaîne de caractères
        answers[input.name] = input.value;
      }
    });

    console.log(answers);
  });


  surveyContainer.appendChild(submitButton);

}


const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/survey.php?id='+id+'');
xhr.send();

// Traitez la réponse du script serveur
xhr.onload = function() {
  if (xhr.status == 200) {
    const data = JSON.parse(xhr.responseText);
    displaySurvey(data);
  }
};