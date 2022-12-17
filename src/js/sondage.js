const survey = {
    "Merci d'entrer ici votre pseudonyme" : [],
    "Etes-vous un homme ou une femme?": ["Homme", "Femme", "Autre", "Je ne souhaite pas répondre"],
    "Dans quelles tranches d'âges vous situez-vous?": ["Moins de 20 ans", "entre 21 et 35 ans", "entre 36 et 60 ans", "plus de 60 ans"],
    "Quel est votre profession": ["Etudiant(e)", "Fonction publique", "Fonction semi-publique", "Salarié en privé", "Autre"],
    "Dans quelles tranches de salaires vous vous trouvez?": ["Moins de 500 dt", "Entre 500 dt et 1000dt", "Entre 1000dt et 1500 dt", "plus de 1500dt"],

    "Quel est votre origine sociale?": [],
    "Achetez-vous du yaourt?": ["Oui", "Non"],
    "Parmi les marques du yaourt ci dessous,les quelles connaissez-vous?": ["Vitalait", "Délice danone", "Still", "Yogo", "Yab", "Nestlé"],
    "Quel est votre marque préféré?": [],
    "A quelle fréquence consommez-vous des yaourts?": ["Une fois par jour", "Deux fois par jour", "Au moins une fois par semaine", "Au moins cinq fois par semaine"],
  };
  /*
  for (const question in survey) {
    console.log(question);
    for (const answer of survey[question]) {
      console.log(`- ${answer}`);
    }
  }
  */

  const surveyDiv = document.querySelector("#survey");
  for (const question in survey) {
    const questionElement = document.createElement("p");
    questionElement.textContent = question;
    questionElement.classList.add("question");
    
    surveyDiv.appendChild(questionElement);

    if(survey[question].length==0){
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.classList.add("formInput");
      input.type = "input";
      input.name = question;
      label.appendChild(input);
      label.appendChild(document.createTextNode(survey[question]));
      surveyDiv.appendChild(label);
    }

    for (const answer of survey[question]) {
      const label = document.createElement("label");
      const radio = document.createElement("input");
      
      radio.type = "radio";
      radio.name = question;
      radio.value = answer;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(answer));
      surveyDiv.appendChild(label);
    }
  }
  const submitButton = document.createElement("button");
  submitButton.textContent = "Soumettre";
  submitButton.addEventListener("click", () => {
    const responses = {};
for (const question in survey) {
  if (survey[question].length === 0) {
    // Récupérer la valeur de l'élément de formulaire de type input
    const response = document.querySelector(`input[name="${question}"]`);
    if (response) {
      responses[question] = response.value;
    }
  } else {
    // Récupérer la valeur de l'élément de formulaire de type radio
    const response = document.querySelector(`input[name="${question}"]:checked`);
    if (response) {
      responses[question] = response.value;
    }
  }
}

    console.log(responses);
    // Envoyer les réponses au serveur ici...
  });
  surveyDiv.appendChild(submitButton);