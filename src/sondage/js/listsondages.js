const survey1 = [{
    type: 'multiple',
    question: 'Quel est votre animal préféré ?',
    choices: ['Chat', 'Chien', 'Oiseau', 'Autre'],
  },
  {
    type: 'unique',
    question: 'Quel est votre film préféré ?',
    choices: ['Le Parrain', 'Retour vers le futur', 'Forrest Gump', 'Autre'],
  },
  {
    type: 'text',
    question: 'Quel est votre plat préféré ?',
  },
  ];

  const survey2 = [{
    type: 'multiple',
    question: 'Quel est votre animal préféré ?',
    choices: ['Chat', 'Chien', 'Oiseau', 'Autre'],
  },
  {
    type: 'unique',
    question: 'Quel est votre film préféré ?',
    choices: ['Le Parrain', 'Retour vers le futur', 'Forrest Gump', 'Autre'],
  },
  {
    type: 'text',
    question: 'Quel est votre plat préféré ?',
  },
  ];

  const survey3 = [{
    type: 'multiple',
    question: 'Quel est votre animal préféré ?',
    choices: ['Chat', 'Chien', 'Oiseau', 'Autre'],
  },
  {
    type: 'unique',
    question: 'Quel est votre film préféré ?',
    choices: ['Le Parrain', 'Retour vers le futur', 'Forrest Gump', 'Autre'],
  },
  {
    type: 'text',
    question: 'Quel est votre plat préféré ?',
  },
  ];

  const surveyList = [];
  surveyList.push(survey1);
  surveyList.push(survey2);
  surveyList.push(survey3);

// Envoyez une requête HTTP GET au script serveur
const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/survey.php');
xhr.send();

// Traitez la réponse du script serveur
xhr.onload = function() {
  if (xhr.status == 200) {
    // Traitez les données de la réponse ici
    console.log(xhr.responseText);
  }
};
