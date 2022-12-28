function createSurveyButton(data){
	const list = document.getElementById('surveyListContainer');
	var button = document.createElement('button');

	button.id = 'button.'+data['name'];

	var div = document.createElement('div');
	div.classList.add('columnBox');

	var surveyName = document.createElement('label');
	surveyName.innerText = 'Sondage : ' + data['name'];

	var nbResponses = document.createElement('label');
	nbResponses.innerText = 'Nombre de réponses : ' + data['nbResponses'];

	button.onclick = () => {
		console.log('button clicked');
		window.location.href = `../sondage/surveyStats.html?idSurvey=${data['id']}`;
	  };


	div.appendChild(surveyName);
	div.appendChild(nbResponses);

	button.appendChild(div);

	list.appendChild(button);
}

function displayCompanySurveys(data){
	data.forEach(element => {
		createSurveyButton(element)
	});
}

function fetchCompanyData(){
	//On récupère via l'url de la page l'id du sondage
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');

	const xhr = new XMLHttpRequest();
	//On récupère via la méthode get et le paramètre id le sondage à afficher
	xhr.open('GET', '../database/companies.php?idCompany=' + id + '');
	xhr.send();

	//On affiche le sondage une fois qu'il a été chargé
	xhr.onload = function() {
		if (xhr.status == 200) {
			const data = JSON.parse(xhr.responseText);
			changeHtml(data);			
		}
	};
}

function fetchCompanySurvey(){
	//On récupère via l'url de la page l'id du sondage
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('id');

	const xhr = new XMLHttpRequest();
	//On récupère via la méthode get et le paramètre id le sondage à afficher
	xhr.open('GET', '../database/survey.php?idCompany=' + id + '');
	xhr.send();

	//On affiche le sondage une fois qu'il a été chargé
	xhr.onload = function() {
		if (xhr.status == 200) {
			const data = JSON.parse(xhr.responseText);
			displayCompanySurveys(data);			
		}
	};
}

function changeHtml(data){
	var companyName = document.getElementById('companyName');
	companyName.innerText = data[0]['name'];
}

fetchCompanyData();
fetchCompanySurvey();