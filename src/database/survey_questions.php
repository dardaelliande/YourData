<?php
// Connectez-vous à la base de données
$mysqli = new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  // Vérifiez si les paramètres sont présents dans la requête GET
  if (isset($_GET['idSurvey'])) {
    // Récupérez les paramètres de la requête GET
    $id = $_GET['idSurvey'];

    // Construisez la requête SQL en utilisant les paramètres
    $query = "SELECT * FROM survey_questions WHERE idSurvey = $id ";
  } else {
    // Construisez la requête SQL sans utiliser les paramètres
    $query = "SELECT * FROM survey";
  }

  // Exécutez la requête
  $result = $mysqli->query($query);

  // Créez un tableau pour stocker les résultats
  $data = [];

  // Parcourez les enregistrements et ajoutez-les au tableau
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }

  // Renvoyez le tableau sous forme de chaîne JSON
  echo json_encode($data);
}

// Créez un tableau pour stocker les résultats
$data = array();

// Parcourez les enregistrements et ajoutez-les au tableau
while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

// Renvoyez le tableau sous forme de chaîne JSON
echo json_encode($data);

// Fermez la connexion à la base de données
$mysqli->close();
?>