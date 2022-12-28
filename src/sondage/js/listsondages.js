function createSurveyCase(survey) {
	const div = document.createElement('div');
	div.classList.add('survey');
  
	// Récupération des données du sondage
	const { name: sondageName, description: sondageDescription, idCompany: company, id } = survey;
  
	const title = document.createElement('h1');
	title.innerText = sondageName;
  
	div.appendChild(title);
  
	// Création d'un bouton renvoyant vers la page /answer.html, avec l'id du sondage associé
	const button = document.createElement('button');
	button.classList.add('surveyButton');
	button.onclick = () => {
	  window.location.href = `answer.html?id=${id}`;
	};
  
	button.appendChild(div);
  
	const container = document.getElementById('surveyListContainer');
	container.appendChild(button);
  }
  
  // Requête GET permettant de récupérer les sondages présents dans la base de données
  fetch('../database/survey.php')
	.then(response => response.json())
	.then(data => {
	  // Création d'une case agissant tel un bouton qui renvoit vers le sondage pour chaque sondage
	  data.forEach(element => {
		createSurveyCase(element);
	  });
	});
  