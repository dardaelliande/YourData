<?php

// Connexion à la base de données
function getDbConnection() {
  return new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);
}

// Traitement de la requête GET
function handleGetRequest() {
  // Exécutez une requête SELECT pour récupérer toutes les données de la table "companies"
  $mysqli = getDbConnection();
  $stmt = $mysqli->prepare('SELECT * FROM companies');
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

// Traitement de la requête POST
function handlePostRequest() {
  // Récupérez les données de la requête POST
  $data = file_get_contents('php://input');

  // Convertissez les données en objet PHP
  $requestData = json_decode($data);

  // Vérifiez si les données sont au format JSON valide
  if ($requestData === NULL) {
    // Erreur : les données de la requête ne sont pas au format JSON valide
    // Gérez l'erreur ici
  } else {
    // Les données de la requête sont au format JSON valide, vous pouvez accéder aux propriétés de l'objet
    $mysqli = getDbConnection();

    // Utilisez les fonctions préparées de MySQLi pour éviter les injections SQL et améliorer les performances en réutilisant les requêtes préparées
    $stmt = $mysqli->prepare('INSERT INTO companies (name, address, phone) VALUES (?, ?, ?)');
    $stmt->bind_param('sss', $requestData->name, $requestData->adress, $requestData->phone);
    $stmt->execute();

    // Vérifiez si l'insertion a réussi
    if ($stmt->affected_rows > 0) {
      echo 'Données enregistrées avec succès';
    } else {
      echo 'Erreur lors de l\'enregistrement des données';
    }

    // Fermez la connexion à la base de données
    $mysqli->close();
  }
}

// Gérez la requête en fonction de sa méthode
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  handleGetRequest();
} 
elseif ($_SERVER['REQUEST_METHOD'] == 'POST') {
  handlePostRequest();
}