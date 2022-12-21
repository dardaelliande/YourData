function createSurveyCase(survey){
  var div = document.createElement('div');
  div.classList.add('survey');
  var sondageName         = survey['name'];
  var sondageDescription  = survey['description'];
  var company             = survey['idCompany'];
  var id                  = survey['id'];

  var title = document.createElement('h1');
  title.innerText=sondageName;

  div.appendChild(title);

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

// Envoyez une requête HTTP GET au script serveur
const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/survey.php');
xhr.send();

// Traitez la réponse du script serveur
xhr.onload = function() {
  if (xhr.status == 200) {
    // Traitez les données de la réponse ici
    const data = JSON.parse(xhr.responseText);
    const dataList = document.getElementById('companyList');
    data.forEach(element => {
        createSurveyCase(element);
    });
  }
};
