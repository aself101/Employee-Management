<?php
/*
include("gemSession2.class.php");
$session = new gemSession();
$level = $session->getLevel($session->data[0]['objectguid'], 'elm');
*/
if(is_ajax()) {
	$config = parse_ini_file('../config.ini');
	$dbname = $config['dbname']; 
	try {
		$db = new PDO("mysql:host=localhost;dbname=$dbname;charset=utf8",$config['username'],$config['password']);
	} catch(PDOException $ex) {
		print("No db connection");
	}
	
	if (isset($_GET['name']) && !empty($_GET['name'])) {
		get($db);
	}
	else if (isset($_GET['employeeComments'])) {
		getComments($db);
	}
	else if (isset($_GET['loadforms'])) {
		loadForms($db);
	}
	else if (isset($_GET['employee']) && !empty($_GET['employee'])) {
		getEmployee($db);
	}
	else if (isset($_GET['e']) && !empty($_GET['e'])) {
		getEmployeeStatus($db);
	}
	else if (isset($_GET['ename']) && !empty($_GET['ename'])) {
		getEId($db);
	}
	else if (isset($_GET['commentSubmit']) && !empty($_GET['commentSubmit'])) {
		insertComment($db);
	}
	else if (isset($_GET['getform']) && !empty($_GET['getform'])) {
		getForm($db);
	}
	else if (isset($_GET['editform']) && !empty($_GET['editform'])) {
		editForm($db);
	}
	else if (isset($_GET['eid']) && !empty($_GET['eid'])) {
		getRequirements($db);
	}
	else if (isset($_GET['deleteform']) && !empty($_GET['deleteform'])) {
		deleteForm($db);
	}
	else if (isset($_GET['deletefield']) && !empty($_GET['deletefield'])) {
		deleteField($db);
	}
	else if (isset($_GET['empid']) && !empty($_GET['empid'])) {
		pullVals($db);
	}
	else if (isset($_POST['addField']) && !empty($_POST['addField'])) {
		updateForm($db);
	}
	else if (isset($_POST['input']) && !empty($_POST['input'])) {
		editEmployee($db);
	}
	else if (isset($_POST['formData']) && !empty($_POST['formData'])) {
		createForm($db);
	}
	else if (isset($_POST['allVals']) && !empty($_POST['allVals'])) {
		submitUserCreatedForm($db);
	}
	else if (isset($_POST) && !empty($_POST)) {
		deleteEmployee($db);
	}
	else {
		echo json_encode("There is no post and somehow you are here.");
	}
}

/* checks to make sure the call is ajax */
function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

/* Pulls comments for a given employee */
function getComments($db) {
	$name = explode(" ", $_GET['employeeComments']);
	$fname = $name[0];
	$lname = $name[1];
	$stmt = $db->prepare("SELECT Author, Comment, Date FROM comments 
		WHERE Fname=? AND Lname=? ORDER BY Id DESC");
	$stmt->execute(array($fname,$lname));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($rows);
}

/* Pulls only requirements */
function getRequirements($db) {
	$e = $_GET["eid"];
	
	$stmt = $db->prepare("SELECT FormName, Requirement, Value, Department FROM requirements WHERE EId=?");
	$stmt->execute(array($e));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($rows);
}

/* Pulls info for view, edit */
function get($db) {
	$e = $_GET["name"];
	
	$stmt = $db->prepare("SELECT * FROM employee AS a, pos AS p
		WHERE a.PositionId=p.PId
		AND a.EmployeeId=?
		GROUP BY a.EmployeeId");
	$stmt->execute(array($e));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($rows);
}

/* For jqueryui autocomplete on status page */
function getEmployee($db) {
	$employee = $_GET['employee'];
	
	$stmt = $db->prepare("SELECT firstName, lastName, EmployeeId FROM employee WHERE firstName LIKE ? ORDER BY firstName");
	$stmt->execute(array('%'.$employee.'%'));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($rows);
}

function getEId($db) {
	$employee = explode(' ', $_GET['ename']);
	$fname = $employee[0];
	$lname = $employee[1];

	$stmt = $db->prepare("SELECT EmployeeId FROM employee WHERE firstName=? AND lastName=?");
	$stmt->execute(array($fname,$lname));
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($result);
}

/* Pulls info for status page: includes status bar updates and basic employee info */
function getEmployeeStatus($db) {
	$name = explode(" ", $_GET['e']);
	$fname = $name[0];
	$lname = $name[1];

	$eid = $_GET['employeeid'];

	$stmt = $db->prepare("SELECT * FROM employee AS a, pos AS b 
		WHERE a.PositionId=b.PId
		AND a.firstName=? AND a.lastName=?");
	$stmt->execute(array($fname, $lname));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// For status bar
	$stmt2 = $db->prepare("SELECT COUNT(*) AS ReqCount FROM requirements 
		WHERE Value NOT LIKE '%N/A%' AND EId=?"); 
	$stmt2->execute(array($eid));
	$reqCount = $stmt2->fetchAll(PDO::FETCH_ASSOC);

	$stmt3 = $db->prepare("SELECT COUNT(*) AS TotalCount FROM requirements 
		WHERE EId=?"); 
	$stmt3->execute(array($eid));
	$totalCount = $stmt3->fetchAll(PDO::FETCH_ASSOC);

	/* Pull all requirements which have values and place in the 'Complete table' */
	$stmt4 = $db->prepare("SELECT Requirement, Department, Date, Value FROM requirements 
		WHERE Value NOT LIKE '%N/A%' AND EId=?
		ORDER BY Department");
	$stmt4->execute(array($eid));
	$reqsWithVals = $stmt4->fetchAll(PDO::FETCH_ASSOC);

	/* Pull all requirements which DO NOT have values and place in the 'TODO table' */
	$stmt5 = $db->prepare("SELECT Requirement, Department, Date, Value FROM requirements 
		WHERE Value LIKE '%N/A%' AND EId=?
		ORDER BY Department");
	$stmt5->execute(array($eid));
	$reqsW0Vals = $stmt5->fetchAll(PDO::FETCH_ASSOC);

	$result = array_merge($rows, $reqCount, $totalCount, $reqsWithVals, $reqsW0Vals);

	echo json_encode($result);

}

/* Deletes employee and all associated tables*/
function deleteEmployee($db) {
	$employee = $_POST['data'];

	$stmt = $db->prepare("DELETE employee, pos 
		FROM employee 
		INNER JOIN pos
		WHERE employee.PositionId=pos.PId
		AND employee.EmployeeId=?");
	$stmt->execute(array($employee));
	
	echo json_encode($employee);
}

/* Edits employee */
function editEmployee($db) {
	$data = $_POST['input'];
	$eid = $_POST['eid'];

	/* employee table */
	$firstname = $data[0];
	$lastname = $data[1];
	
	$email = $data[9];
	$manager = $data[3];
	$hiredate = $data[4];
	$startdate = $data[5];
	$enddate = $data[6];
	$accountname = $data[7];
	$displayname = $data[8];
	$unixhomedir = $data[10];

	/* pos table */
	$ptitle = $data[2];
	$country = $data[11];
	$location = $data[12];
	$state = $data[13];
	$company = $data[14];
	$address = $data[15];
	$department = $data[16];
	
	
	$stmt = $db->prepare("UPDATE employee, pos
		SET employee.firstName=?,employee.lastName=?,employee.Email=?,employee.HireDate=?,
		employee.StartDate=?,employee.EndDate=?,employee.Manager=?,
		employee.AccountName=?,employee.DisplayName=?,
		employee.UnixHomeDir=?,pos.Ptitle=?,pos.PLocation=?,
		pos.PState=?,pos.PCompany=?,pos.PAddress=?,
		pos.PDepartment=?,pos.PCountry=?
		WHERE employee.PositionId=pos.PId
		AND employee.EmployeeId=?");


	$stmt->execute(array($firstname,$lastname,$email,$hiredate,$startdate,$enddate,$manager,
		$accountname,$displayname,$unixhomedir,$ptitle,$location,$state,$company,
		$address,$department,$country,$eid));
	
	
	echo json_encode($data);
}

function insertComment($db) {
	$name = explode(" ", $_GET['commentSubmit']);
	$fname = $name[0];
	$lname = $name[1];
	$author = $_POST['author'];
	$text = $_POST['text'];
	$date = date('l jS \of F Y h:i:s A');

	
	$stmt = $db->prepare("INSERT INTO comments(Author, Comment, Date, FName, LName)
	VALUES(?,?,?,?,?)");
	$stmt->execute(array($author,$text,$date,$fname,$lname));	
 	
	echo json_encode("Name: ".$fname.' '.$lname.' Author: '.$author.' text: '.$text);
}

/****************************************************************
All functions associated with creating, updating, deleting forms
*****************************************************************/
function createForm($db) {
	$theForm = $_POST['formData'];
	$formName = $_POST['formname'];
	$dept = $_POST['department'];
	
	for($i = 0; $i < count($theForm); $i++) {
		$stmt = $db->prepare("INSERT INTO fields(Label, FieldId, Type, FormName, Department, FieldValues, Permission)
			VALUES(?,?,?,?,?,?,?)");
		$stmt->execute(array($theForm[$i]['Label'],$theForm[$i]['Id'],$theForm[$i]['Type'],$formName,$dept,$theForm[$i]['Values'],$theForm[$i]['Permission']));
	}

	echo json_encode($formName);
}

/* Submit user created form */
function submitUserCreatedForm($db) {
	$vals = $_POST['allVals'];
	$e = $_POST['employee'];
	$form = $_POST['form'];
	$dept = $_POST['dept'];
	$date = date('m-j-Y');
	
	/* Do server side check to see if an employee is already in the db with the form name; if so, just update */
	/* Return a flag that will allow the user to see that the employee was updated or newly inserted */
	$check = $db->prepare("SELECT Requirement FROM requirements WHERE EId=? AND FormName=?");
	$check->execute(array($e,$form));
	$verify = $check->fetchAll(PDO::FETCH_ASSOC);

	if (!empty($verify)) {
		for($i = 0; $i < count($vals); $i++) {
			if ($vals[$i] === "") {}
			else {	
				$stmt = $db->prepare("UPDATE requirements SET Date=?,Value=?
					 WHERE Requirement=?
					 AND EId=?
					 AND FormName=?");
				$stmt->execute(array($date,$vals[$i]['Vals'],$vals[$i]['Id'],$e,$form));
			}
		}
		echo json_encode(array(1,$form));
	}
	else {
		for($i = 0; $i < count($vals); $i++) {
			if ($vals[$i] === "") {}
			else {	
				$stmt = $db->prepare("INSERT INTO requirements(Requirement,Department,Date,Value,EId,FormName) 
					VALUES(?,?,?,?,?,?)");
				$stmt->execute(array($vals[$i]['Id'],$dept,$date,$vals[$i]['Vals'],$e,$form));
			}
		}
		echo json_encode(array(0,$form));
	}
	
}

/* Pulls the individual form a user selects */
function getForm($db) {
	$form = $_GET['getform'];

	$stmt = $db->prepare("SELECT Label, FieldId, Type, FormName, Department, FieldValues, Permission FROM fields WHERE FormName=?");
	$stmt->execute(array($form));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($rows);

}

/* Remove individual form fields */
function editForm($db) {
	$form = $_GET['editform'];

	$stmt = $db->prepare("SELECT Label, FieldId, Type, FormName, FieldValues, Department FROM fields WHERE FormName=?");
	$stmt->execute(array($form));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($rows);
}

/* Deletes the entire form */
function deleteForm($db) {
	$form = $_GET['deleteform'];

	$stmt = $db->prepare("DELETE FROM fields WHERE FormName=?");
	$stmt->execute(array($form));
	$stmt = $db->prepare("DELETE FROM requirements WHERE FormName=?");
	$stmt->execute(array($form));

	echo json_encode("Deleted: " + $form);
}

/* Loads all forms into a table to be retrieved */
function loadForms($db) {
	
	$stmt = $db->prepare("SELECT DISTINCT FormName FROM fields ORDER BY FormName ASC");
	$stmt->execute();
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($rows);
}

/* Add individual fields to a preexisting form */
function updateForm($db) {
	$formname = $_POST['formname'];
	$input = $_POST['addField'];
	$dept = $_POST['dept'];
	$opts = $_POST['opts'];
	$type = $_POST['fieldtype'];

	/* If there exists whitespace on input, concat the string together for an Id; leave label as is */
	if(strpos($input, ' ') !== false) {
		$fieldId = str_replace(' ', '', $input);

		$stmt = $db->prepare("INSERT INTO fields(Label, FieldId, Type, FormName, Department, FieldValues) VALUES(?,?,?,?,?,?) ");
		$stmt->execute(array($input,$fieldId,$type,$formname,$dept,$opts));	

		echo json_encode("Success");
		
	}
	else {
		$stmt = $db->prepare("INSERT INTO fields(Label, FieldId, Type, FormName, Department, FieldValues) VALUES(?,?,?,?,?,?) ");
		$stmt->execute(array($input,$input,$type,$formname,$dept,$opts));

		
		echo json_encode("Success");
	}

}

/* Deletes an individual field within the form */
function deleteField($db) {
	$field = $_GET['deletefield'];
	$formname = $_GET['editFormName'];

	$stmt = $db->prepare("DELETE FROM fields WHERE FieldId=? AND FormName=?");
	$stmt->execute(array($field,$formname));

	$stmt = $db->prepare("DELETE FROM requirements WHERE Requirement=? AND FormName=?");
	$stmt->execute(array($field,$formname));	

	$stmt = $db->prepare("SELECT Label, FieldId, FormName FROM fields WHERE FormName=?");
	$stmt->execute(array($formname));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($rows);
}

/* Pulls pre-existing employee info from requirements table to auto fill a user created form */
function pullVals($db) {
	$eid = $_GET['empid'];
	$form = $_GET['pulledform'];

	$stmt = $db->prepare("SELECT Value, Requirement FROM requirements  
		WHERE EId=? AND FormName=?");
	$stmt->execute(array($eid,$form));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
	
	echo json_encode($rows);
}



?>