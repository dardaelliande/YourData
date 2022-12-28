//On récupère via l'url de la page l'id du sondage
const urlParams = new URLSearchParams(window.location.search);
const idSurvey = urlParams.get('idSurvey');

document.getElementById('idSurvey').innerText = idSurvey;

function parseQuestions(data){
    const organizedData = data.reduce((acc, curr) => {
        const { question, response, response_count } = curr;
        if (!acc[question]) {
          acc[question] = [];
        }
        acc[question].push({ response, response_count });
        return acc;
      }, {});
      
      console.log(organizedData);
      

    return organizedData;
}

function displayStats(data){
    var questions = parseQuestions(data);

    Object.keys(questions).forEach(element => {

        var questionDiv = document.createElement ('div');
        var questionTitle = document.createElement('label');
        questionTitle.innerText = element;
        questionDiv.style = 'background-color : green;'

        questionDiv.appendChild(questionTitle);

        var totalresponses = 0;

        questions[element].forEach(element => {
            totalresponses += element['response_count'];
        });

        questions[element].forEach(element => {
            console.log(element);
            var responseInfos       = document.createElement('div');
            responseInfos.style     = 'background-color : red; display : flex; flex-direction : row; justify-content:space-around;';
            var labelChoice         = document.createElement ('label');
            labelChoice.innerText   = element['response'];
            var nbResponses        = document.createElement ('label');
            nbResponses.innerText   = element['response_count']+'('+(element['response_count']/totalresponses)*100+'%)';

            responseInfos.appendChild(labelChoice);
            responseInfos.appendChild(nbResponses);

            questionDiv.appendChild(responseInfos);
        });
        document.getElementById('surveyStats').appendChild(questionDiv);
    });
}

function fetchSurveyStats(){

	const xhr = new XMLHttpRequest();
	//On récupère via la méthode get et le paramètre id le sondage à afficher
	xhr.open('GET', '../database/user_responses.php?idSurvey=' + idSurvey + '');
	xhr.send();

	//On affiche le sondage une fois qu'il a été chargé
	xhr.onload = function() {
		if (xhr.status == 200) {
			const data = JSON.parse(xhr.responseText);
			displayStats(data);		
		}
	};
}

fetchSurveyStats();