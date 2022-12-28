<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
// Connectez-vous à la base de données
$mysqli = new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);

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
            $idSurvey = $response['idSurvey'];
            // Pour chaque réponse de l'utilisateur
            foreach ($responses as $response) {
                // Insérez la réponse de l'utilisateur dans la base de données
                $stmt = $mysqli->prepare(
                    "INSERT INTO user_responses (idQuestion, idUser, response, idSurvey) VALUES (?, ?, ?, ?)"
                );
                $stmt->bind_param("iisi", $question, $user, $response, $idSurvey);
                $stmt->execute();

                // Vérifiez si l'insertion a réussi
                if ($mysqli->affected_rows > 0) {
                    echo "Données enregistrées avec succès \n";
                } else {
                    echo "Erreur lors de l'enregistrement des données \n";
                }
            }
        }
    }
}
else
{
    if (isset($_GET["idSurvey"])) {
        // Récupérons l'ID du sondage
        $idSurvey = $_GET["idSurvey"];

        // Préparez la requête SQL
        $sql = "SELECT s.name, s.description, r.response, q.question, COUNT(r.response) AS response_count
        FROM SURVEY s
        LEFT JOIN SURVEY_QUESTIONS q ON s.id = q.idSurvey
        LEFT JOIN USER_RESPONSES r ON q.id = r.idQuestion
        WHERE s.id = ?
        GROUP BY s.id, q.id, r.response, r.idQuestion";
        $stmt = $mysqli->prepare($sql);
        // Liez les paramètres
        $stmt->bind_param("i", $idSurvey);

        // Exécutez la requête
        $stmt->execute();

        // Traitez les résultats de la requête
        $result = $stmt->get_result();

        // Créez un tableau pour stocker les résultats
        $data = [];

        // Parcourez les enregistrements et ajoutez-les au tableau
        while ($row = $result->fetch_assoc()) {
            if($row['response'] !=null ){
                $data[] = $row;
            }
        }


        if (is_array($data)) 
        {
            // Renvoyez le tableau sous forme de chaîne JSON
            echo json_encode($data);
        } 
        else 
        {
            // Gérez l'erreur ici, par exemple en affichant un message d'erreur
            echo "Erreur : la variable 'data' n'est pas un tableau";
        }

        // Fermez la connexion à la base de données
        $mysqli->close();
    }
    else{
        echo "any variable idSurvey";
    }

    
}
?>
