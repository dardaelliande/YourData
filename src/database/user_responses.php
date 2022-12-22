<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Connectez-vous à la base de données
$mysqli = new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);

/*
// Vérifiez la méthode de la requête HTTP
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérez les données de la requête
    $data = file_get_contents("php://input");

    // Décodez les données en tableau PHP
    $requestData = json_decode($data, true);

    echo "requestData : " . $requestData[0];

    // Vérifiez si les données sont du JSON valide
    if ($requestData['idQuestion'] == null) {
        // Erreur : les données de la requête ne sont pas du JSON valide
        // Gérez l'erreur ici
    } else {
        
        // Affectez les valeurs des données de la requête à des variables
        $question = $requestData['idQuestion'];
        $response = $requestData['responses'];
        $user = 1; // Vous pouvez remplacer cette valeur par l'identifiant de l'utilisateur actuel s'il est connecté

        
        // Insérez les réponses de l'utilisateur dans la base de données
        $stmt = $mysqli->prepare(
            "INSERT INTO user_responses (idQuestion, idUser, response) VALUES (?, ?, ?)"
        );
        $stmt->bind_param("iis", $question[0], $user, $response[0]);
        $stmt->execute();
        if ($stmt->error) {
            echo "Erreur dans la requête SQL : " . $stmt->error;
        }
        echo "Question : " . $question;

        // Vérifiez si l'insertion a réussi
        if ($mysqli->affected_rows > 0) {
            echo "Données enregistrées avec succès";
        } else {
            echo "Erreur lors de l'enregistrement des données";
        }
    }
}
*/
// Vérifiez la méthode de la requête HTTP
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Récupérez les données de la requête
    $data = file_get_contents("php://input");

    // Décodez les données en tableau PHP
    $requestData = json_decode($data, true);

    // Vérifiez si les données sont du JSON valide
    if ($requestData === null) {
        // Erreur : les données de la requête ne sont pas du JSON valide
        // Gérez l'erreur ici
    } else {
        // Pour chaque objet dans le tableau
        foreach ($requestData as $response) {
            // Affectez les valeurs des données de la requête à des variables
            $question = $response['idQuestion'];
            $responses = $response['responses'];
            $user = 1; // Vous pouvez remplacer cette valeur par l'identifiant de l'utilisateur actuel s'il est connecté

            // Pour chaque réponse de l'utilisateur
            foreach ($responses as $response) {
                // Insérez la réponse de l'utilisateur dans la base de données
                $stmt = $mysqli->prepare(
                    "INSERT INTO user_responses (idQuestion, idUser, response) VALUES (?, ?, ?)"
                );
                $stmt->bind_param("iis", $question, $user, $response);
                $stmt->execute();

                // Vérifiez si l'insertion a réussi
                if ($mysqli->affected_rows > 0) {
                    echo "Données enregistrées avec succès";
                } else {
                    echo "Erreur lors de l'enregistrement des données";
                }
            }
        }
    }
}
?>