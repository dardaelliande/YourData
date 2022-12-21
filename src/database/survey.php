<?php
// Connectez-vous à la base de données
$mysqli = new mysqli("127.0.0.1", "root", "", "YourDataBase", null);

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["id"])) {
        // Récupérez les paramètres de la requête GET
        $idSurvey = $_GET["id"];

        // Retrieve the survey data from the database
        $stmt = $mysqli->prepare("SELECT * FROM survey WHERE id = ?");
        $stmt->bind_param("i", $idSurvey);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Check if the survey was found
        if ($result->num_rows > 0) {
            // Survey was found, retrieve the data
            $row = $result->fetch_assoc();
            $company = $row["idCompany"];
            $surveyName = $row["name"];

            // Retrieve the questions for the survey
            $stmt = $mysqli->prepare(
                "SELECT * FROM survey_questions WHERE idSurvey = ?"
            );
            $stmt->bind_param("i", $idSurvey);
            $stmt->execute();
            $result = $stmt->get_result();

            $questions = [];
            while ($row = $result->fetch_assoc()) {
                $question = [];
                $question["type"] = $row["answer_type"];
                $question["question"] = $row["question"];

                // Retrieve the choices for the question
                $stmt = $mysqli->prepare(
                    "SELECT * FROM survey_responses WHERE idQuestion = ?"
                );
                $stmt->bind_param("i", $row["id"]);
                $stmt->execute();
                $choicesResult = $stmt->get_result();

                $choices = [];
                while ($choiceRow = $choicesResult->fetch_assoc()) {
                    $choices[] = $choiceRow["response"];
                }
                $question["choices"] = $choices;

                $questions[] = $question;
            }

            // Return the survey data
            $response = [];
            $response["company"] = $company;
            $response["name"] = $surveyName;
            $response["questions"] = $questions;
            echo json_encode($response);
        } else {
            // Survey was not found
            echo "Survey not found";
        }
    } 
    else {
      // Construisez la requête SQL sans utiliser les paramètres
      $query = "SELECT * FROM survey";
      // Créez un tableau pour stocker les résultats
      $data = [];
      //Récupération des résultats
      $result=$mysqli->query($query);
      // Parcourez les enregistrements et ajoutez-les au tableau
      while ($row = $result->fetch_assoc()) {
        $data[] = $row;
      }
      // Renvoyez le tableau sous forme de chaîne JSON
      echo json_encode($data);
    }

    
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the request data
    $data = file_get_contents("php://input");

    // Decode the data as a PHP object
    $requestData = json_decode($data);

    // Check if the data is valid JSON
    if ($requestData === null) {
        // Error: the request data is not valid JSON
        // Handle the error here
    } else {
        // Get the data from the object
        $company = $requestData->company;
        $surveyName = $requestData->name;
        $questions = $requestData->questions;

        // Insert the survey into the database
        $stmt = $mysqli->prepare(
            "INSERT INTO survey (name, description, idCompany) VALUES (?, NULL, NULL)"
        );
        $stmt->bind_param("s", $surveyName);
        $stmt->execute();

        // Get the id of the inserted survey
        $idSurvey = $mysqli->insert_id;

        // Loop through the questions and process them
        foreach ($questions as $question) {
            $questionType = $question->type;
            $questionText = $question->question;
            $choices = $question->choices;

            // Insert the question into the database
            $stmt = $mysqli->prepare(
                "INSERT INTO survey_questions (idSurvey, question, answer_type) VALUES (?, ?, ?)"
            );
            $stmt->bind_param("iss", $idSurvey, $questionText, $questionType);
            $stmt->execute();
            $idQuestion = $mysqli->insert_id;

            // Loop through the choices and insert them into the database
            foreach ($choices as $choice) {
                $stmt = $mysqli->prepare(
                    "INSERT INTO survey_responses (idQuestion, response) VALUES (?, ?)"
                );
                $stmt->bind_param("is", $idQuestion, $choice);
                $stmt->execute();
            }
        }

        // Check if the insert was successful
        if ($mysqli->affected_rows > 0) {
            echo "Data saved successfully";
        } else {
            echo "Error saving data";
        }
    }
}

// Fermez la connexion à la base de données
$mysqli->close();
?>
