<?php

// Connexion à la base de données
function getDbConnection()
{
    return new mysqli("127.0.0.1", "root", "", "YourDataBase", null);
}

// Traitement de la requête GET
function handleGetRequest()
{
    // Vérifiez si les paramètres sont présents dans la requête GET
    if (isset($_GET["idSurvey"])) {
        // Récupérez les paramètres de la requête GET et utilisez la fonction real_escape_string pour échapper les caractères spéciaux
        $mysqli = getDbConnection();
        $id = $mysqli->real_escape_string($_GET["idSurvey"]);

        // Construisez la requête SQL en utilisant les paramètres
        $stmt = $mysqli->prepare(
            "SELECT * FROM survey_questions WHERE idSurvey = ?"
        );
        $stmt->bind_param("i", $id);
    } else {
        // Construisez la requête SQL sans utiliser les paramètres
        $mysqli = getDbConnection();
        $stmt = $mysqli->prepare("SELECT * FROM survey");
    }
    // Exécutez la requête
    $stmt->execute();
    $result = $stmt->get_result();

    // Créez un tableau pour stocker les résultats
    $data = [];

    // Parcourez les enregistrements et ajoutez-les au tableau
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Renvoyez le tableau sous forme de chaîne JSON
    echo json_encode($data);

    // Fermez la connexion à la base de données
    $mysqli->close();
}

// Gérez la requête en fonction de sa méthode
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    handleGetRequest();
}
