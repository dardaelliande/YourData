<?php
// Connectez-vous à la base de données
$mysqli = new mysqli('127.0.0.1', 'root', '', 'YourDataBase', NULL);

// Exécutez une requête SELECT
$result = $mysqli->query('SELECT * FROM user');

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