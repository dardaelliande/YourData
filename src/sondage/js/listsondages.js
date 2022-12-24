function createSurveyCase(survey) {
	var div = document.createElement('div');
	div.classList.add('survey');
	//Récupération des données du sondage
	var sondageName = survey['name'];
	var sondageDescription = survey['description'];
	var company = survey['idCompany'];
	var id = survey['id'];

	var title = document.createElement('h1');
	title.innerText = sondageName;

	div.appendChild(title);

	//Création d'un boutton renvoyant vers la page /answer.html, avec l'id du sondage associé
	var button = document.createElement('button');
	button.classList.add('surveyButton');
	button.appendChild(div);
	button.onclick = function() {
		window.location.href = `answer.html?id=${id}`;
	}

	console.log(button.onclick);

	var container = document.getElementById('surveyListContainer');
	container.appendChild(button);
}

// Requête GET permettant de récupérer les sondages présents dans la base de données
const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/survey.php');
xhr.send();

xhr.onload = function() {
	if (xhr.status == 200) {
		// data = liste des sondages
		const data = JSON.parse(xhr.responseText);
		const dataList = document.getElementById('companyList');
		//Création d'une case agissant tel un boutton qui renvoit vers le sondage pour chaque sondage
		data.forEach(element => {
			createSurveyCase(element);
		});
	}
};