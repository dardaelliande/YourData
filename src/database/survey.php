<?php
// Connectez-vous à la base de données
$mysqli = new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  // Exécutez une requête SELECT
  $result = $mysqli->query('SELECT * FROM survey');

  // Créez un tableau pour stocker les résultats
  $data = [];

  // Parcourez les enregistrements et ajoutez-les au tableau
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  // Renvoyez le tableau sous forme de chaîne JSON
  echo json_encode($data);
}
elseif($_SERVER['REQUEST_METHOD'] == 'POST'){
  // Get the request data
  $data = file_get_contents('php://input');

  // Decode the data as a PHP object
  $requestData = json_decode($data);

  // Check if the data is valid JSON
  if ($requestData === NULL) {
    // Error: the request data is not valid JSON
    // Handle the error here
  } else {
    // Get the data from the object
    $company    = $requestData->company;
    $surveyName = $requestData->name;
    $questions  = $requestData->questions;

    // Insert the survey into the database
    $stmt = $mysqli->prepare("INSERT INTO survey (name, description, idCompany) VALUES (?, NULL, NULL)");
    $stmt->bind_param("s", $surveyName);
    $stmt->execute();

    // Get the id of the inserted survey
    $idSurvey = $mysqli->insert_id;

    // Loop through the questions and process them
    foreach ($questions as $question) {
      $questionType = $question->type;
      $questionText = $question->question;
      $choices      = $question->choices;

      // Insert the question into the database
      $stmt = $mysqli->prepare("INSERT INTO survey_questions (idSurvey, question, answer_type) VALUES (?, ?, ?)");
      $stmt->bind_param("iss", $idSurvey, $questionText, $questionType);
      $stmt->execute();
      $idQuestion = $mysqli->insert_id;

      // Loop through the choices and insert them into the database
      foreach($choices as $choice){
        $stmt = $mysqli->prepare("INSERT INTO survey_responses (idQuestion, response) VALUES (?, ?)");
        $stmt->bind_param("is", $idQuestion, $choice);
        $stmt->execute();
      }
    }

    // Check if the insert was successful
    if ($mysqli->affected_rows > 0) {
      echo 'Data saved successfully';
    } else {
      echo 'Error saving data';
    }
  }
}



// Fermez la connexion à la base de données
$mysqli->close();
?>