<?php


if(is_ajax()) {
	$config = parse_ini_file('../config.ini');
	$dbname = $config['dbname']; 
	$db = new PDO("mysql:host=localhost;dbname=$dbname;charset=utf8",$config['username'],$config['password']);

	if(isset($_POST) && !empty($_POST)) {
		createEmployee($db);
	}
	else if(isset($_GET) && !empty($_GET)) {
		get($db);
	}
	else {
		echo json_encode("There is no post or get and somehow you are here.");
	}
}

function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function get($db) {
	$rows = array();
	$sql = "SELECT * FROM employee";
	$res = $db->query($sql);
	$rows = $res->fetchAll();

	echo json_encode($rows);
}

function validate($db) {
	$stmt = $db->prepare("SELECT firstName, lastName FROM employee WHERE firstName LIKE ? ORDER BY firstName");
	$stmt->execute(array('%'.$employee.'%'));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function mailOut($firstname,$lastname,$hireDate,$email,$endDate,$position,
	$manager,$department,$company,$office,$officePhone1,$officeNum,$hireCategory) {

	$categories = array($firstname,$lastname,$position,$manager,$hireDate,$endDate,$hireCategory,$department,$company,$email,
		$office,$officeNum,$officePhone1);
	/* If there is a missing value, substitute N/A */
	for($i = 0; $i < count($categories); $i++) {
		if ($categories[$i] === '') {
			$categories[$i] = 'N/A';
		}
	}	

	$to = 'aself@gemini.edu';
	$subject = 'Testing mail for employee creation';

	$message = "<html><body>";
	$message .= "<center><hr><h1>Please welcome: " . strip_tags($categories[0]) . " " . strip_tags($categories[1]) . "<h1><hr></center>\r";
	$message .= '<img style="width: 100%;" src="http://www.gemini.edu/themes/www.gemini.edu/themes/4/images/header/header-top-3.jpg" alt="Gemini new employee" />';
	$message .= '<table rules="all" style="width: 100%;border-color: #666;" cellpadding="10">';
	$message .= "<tr style='background: #eee;'><td><strong>Employee:</strong> </td><td>" . strip_tags($categories[0]) . " " . strip_tags($categories[1]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Position:</strong> </td><td>" . strip_tags($categories[2]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Manager:</strong> </td><td>" . strip_tags($categories[3]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Hire Date:</strong> </td><td>" . strip_tags($categories[4]) . "</td></tr>\r";
	$message .= "<tr><td><strong>End Date:</strong> </td><td>" . strip_tags($categories[5]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Hire Category:</strong> </td><td>" . strip_tags($categories[6]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Department:</strong> </td><td>" . strip_tags($categories[7]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Base Location:</strong> </td><td>" . strip_tags($categories[8]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($categories[9]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Office:</strong> </td><td>" . strip_tags($categories[10]) . " " . strip_tags($categories[11]) . "</td></tr>\r";
	$message .= "<tr><td><strong>Phone:</strong> </td><td>" . strip_tags($categories[12]) . "</td></tr>\r";	
	$message .= "</table><br />\r";
	$message .= "<center><hr><h3>1st Day Schedule</h3><hr>";
	$message .= '<table rules="all" style="width: 50%;border-color: #666;" cellpadding="7">';
	$message .= "<tr><td><b>9:00 am</b></td><td>AFG Orientation</td></tr>";
	$message .= "<tr><td><b>9:30 am</b></td><td>HR Benefits</td></tr>";
	$message .= "<tr><td><b>10:30 am</b></td><td>ISG Orientation</td></tr>";
	$message .= "<tr><td><b>11:00 am</b></td><td>Meet with Manager</td></tr>";
	$message .= "<tr><td><b>12:00 pm</b></td><td>Lunch with team</td></tr>";
	$message .= "<tr><td><b>1:30 pm</b></td><td>Safety Orientation</td></tr>";
	$message .= "<tr><td><b>2:30 pm</b></td><td>Meet with Manager</td></tr>";
	$message .= "</table>";
	$message .= "</center><br /><hr><center><h3>Staff Requirements</h3></center><hr>";
	$message .= '<table rules="all" style="width: 100%;border-color: #666;" cellpadding="10">';
	$message .= '<tr style="background: #eee;"><th>Human Resources</th><th>AFG Orientation</th><th>Safety</th><th>ISG</th><th>Payroll</th><th>PIO</th></tr>';
	$message .= '<tr><td>Send out On-Boarding Packet</td><td>Orientation</td><td>Orientation</td><td>Orientation</td><td>Timesheets</td><td>Staff photo for website</td></tr>';
	$message .= '<tr><td>CIO</td><td>Assign Office Space</td><td>HAP</td><td>Computer setup</td><td>Reqless</td><td></td></tr>';
	$message .= '<tr><td>Harassment Training Modules</td><td>Mailbox Cubby</td><td>Drivers Training</td><td>Active Directory</td><td></td><td></td></tr>';
	$message .= '<tr><td>Ultipro</td><td></td><td></td><td>Project Insight Account</td><td></td><td></td></tr>';
	$message .= '<tr><td>Useful Links</td><td></td><td></td><td>DocuShare Account</td><td></td><td></td></tr>';
	$message .= '<tr><td>VISA Requirements</td><td></td><td></td><td>Phone setup</td><td></td><td></td></tr>';
	$message .= '<tr><td>Realtor Links</td><td></td><td></td><td></td><td></td><td></td></tr>';
	$message .= "</table><br>";
	$message .= "<center><hr><h3>Hiring Manager</h3><hr></center>";
	$message .= "<ul><li><b>Discussion with employee on Job description, performance expectations, schedules, timecard, sick leave, etc.</b></li>";
	$message .= "<li><b>Additional project accounts needed on timecard selection list, send email toPayroll@aura-astronomy.org.</b></li>";
	$message .= "<li><b>Account viewing permissions need on CASNET (if any), send email tocasnet@aura-astronomy.org.</b></li>";
	$message .= "<li><b>Approve signature authority on accounts (if any), send email toprocurement@aura-astronomy.org.</b></li>";
	$message .= "</ul>";
	$message .= "</body></html>";

	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html;' . "\r\n";
	$headers .= 'From: Test <aself@hawaii.edu>' . "\r\n";
	mail($to, $subject, $message, $headers);

}

function createEmployee($db) {

	if($db === false) {
    	echo "Could not connect.";
	}
	
	// employee id
	$eid = 0;
	// position id
	$pid = 0;
	
	
	for($i = 0; $i < 7; $i++) {
		$eid .= mt_rand(0,9);
		$pid .= mt_rand(0,9);
	}

	/* employee */
	$firstname = $_POST["firstName"];
	$lastname = $_POST["lastName"];
	$email = $_POST["email"];
	$hireDate = $_POST["hireDate"];
	$startDate = $_POST["startDate"];
	$endDate = $_POST["endDate"];
	$manager = $_POST["manager"];

	/* position */
	$position = $_POST["posTitle"];	
	$hireLoc = $_POST["hireLoc"];
	$state = $_POST["state"];
	$company = $_POST["company"];
	$address = $_POST["address"];
	$country = $_POST["country"];
	
	/* department */
 	$department = $_POST["department"];
	
	/* einfo */
	$accountName = $_POST["accountName"];
	$displayName = $_POST["displayName"];
	$unixHomeDir = $_POST["unixHomeDir"];
	
	$stmt = $db->prepare("INSERT INTO employee(firstName, lastName, EmployeeId, Email, PositionId, HireDate, StartDate, EndDate, Manager, AccountName, DisplayName, UnixHomeDir) 
		VALUES(?,?,?,?,?,?,?,?,?,?,?,?)");
	$stmt->execute(array($firstname,$lastname,$eid,$email,$pid,$hireDate,$startDate,$endDate,$manager,$accountName,$displayName,$unixHomeDir));
	
	$stmt = $db->prepare("INSERT INTO pos(PId, PTitle, PLocation, PState, PCompany, PAddress, PDepartment, PCountry) 
		VALUES(?,?,?,?,?,?,?,?)");
	$stmt->execute(array($pid,$position,$hireLoc,$state,$company,$address,$department,$country));
	
	//	
	// TODO: Mailout needs to reflect new form and display only values available OR...
	//		Create a clickable button which sends the email out via ajax call once all relevant
	//		information has been recieved	
	//mailOut($firstname,$lastname,$hireDate,$email,$endDate,$position,
	//	$manager,$department,$company,$office,$officePhone1,$officeNum,$hireCategory);	
	echo json_encode(array($pid,$position));

}

?>
