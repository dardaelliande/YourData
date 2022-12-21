<?php
// Connectez-vous à la base de données
$mysqli = new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  // Exécutez une requête SELECT
  $result = $mysqli->query('SELECT * FROM companies');

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
    $name = $mysqli->real_escape_string($requestData->name);
    $address = $mysqli->real_escape_string($requestData->adress);
    $phone = $mysqli->real_escape_string($requestData->phone);

    // Exécutez une requête INSERT
    $mysqli->query("INSERT INTO companies (name, address, phone) VALUES ('$name', '$address', '$phone')");

    // Vérifiez si l'insertion a réussi
    if ($mysqli->affected_rows > 0) {
      echo 'Données enregistrées avec succès';
    } else {
      echo 'Erreur lors de l\'enregistrement des données';
    }
  }
}



// Fermez la connexion à la base de données
$mysqli->close();
?>