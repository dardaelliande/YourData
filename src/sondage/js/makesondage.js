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

// Crée un bouton permettant de soumettre les données de la question
function createButtonSubmit() {
  const button = document.createElement('button');
  button.innerText = 'Soumettre';

  // Lorsque le bouton est cliqué, il récupère les données de la question et les envoie via une requête HTTP
  button.addEventListener('click', function(event) {
    event.preventDefault();

    const title = this.parentElement.querySelector('#textTitleInput').value;
    const type = this.parentElement.querySelector('#selectedType').value;
    const options = [];
    const optionInputs = this.parentElement.querySelectorAll('#optionInput');

    optionInputs.forEach(input => {
      options.push(input.value);
    });

    const data = { title, type, options };

    // Envoi de la requête HTTP
    fetch('/database/addQuestion.php', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        // Affichage du résultat de la requête
        console.log(result);
      });
  });

  return button;
}

// Crée tous les éléments de la page
function createElements() {
  const mainElement = document.querySelector('main');

  mainElement.appendChild(createQuestionTitle());
  mainElement.appendChild(createQuestionType());
  mainElement.appendChild(createBoxToAddOption());
  mainElement.appendChild(createButtonAddOption());
  mainElement.appendChild(createButtonSubmit());
}

createElements();
