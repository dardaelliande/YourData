<?php

// Connexion à la base de données
function getDbConnection() {
  return new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);
}

// Traitement de la requête SELECT
function handleSelectRequest() {
  // Récupérez toutes les données de la table "survey_responses"
  $mysqli = getDbConnection();
  $stmt = $mysqli->prepare('SELECT * FROM survey_responses');

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
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  handleSelectRequest();
}
