<?
  header("Content-Type: text/html; charset=utf-8");
	include_once('db_connect.php');
  $id = $_POST['id'];
  $type = $_POST['type'];
  $query="SELECT * FROM calculation_link WHERE $type=".$id;
  $result = mysqli_query($link,$query) or die(mysqli_error($link));
  $resultJson = array();
  while($row=mysqli_fetch_array($result, MYSQLI_ASSOC)){
     $resultJson[]=$row;
  }
  echo json_encode($resultJson);