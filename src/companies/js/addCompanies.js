// Envoyez une requête HTTP GET au script serveur
const xhr = new XMLHttpRequest();
xhr.open('GET', '../database/companies.php');
xhr.send();

// Traitez la réponse du script serveur
xhr.onload = function() {
  if (xhr.status == 200) {
    // Traitez les données de la réponse ici;
    const data=JSON.parse(xhr.responseText);
  }
};

document.getElementById('submit').addEventListener('click', function() {  
    console.log("buttonClicked");
    // Envoyez une requête HTTP POST au script serveur
    const postRequest = new XMLHttpRequest();
    postRequest.open('POST', '../database/companies.php');
    postRequest.setRequestHeader('Content-Type', 'application/json');
  
    // Préparez les données de la requête
    const companyName = document.getElementById('companyName').value;
    const companyAddress = document.getElementById('companyAddress').value;
    const companyPhone = document.getElementById('companyPhone').value;
    const data = {
      name: companyName,
      adress: companyAddress,
      phone: companyPhone
    };
  
    // Traitez la réponse du script serveur
    postRequest.onload = function() {       
      if (postRequest.status == 200) {
        console.log(postRequest.responseText);
      }
    };
  
    // Envoyez la requête avec les données préparées
    postRequest.send(JSON.stringify(data));
  });
  