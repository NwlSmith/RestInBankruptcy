function expand(){
	var arrow = document.getElementById("arrow");
	var details = document.getElementById("details");


	if (arrow.style.transform == "rotate(0deg)"){
		details.style.display = "block";
		arrow.style.transform = "rotate(180deg)";
	}
	else{
		details.style.display = "none";
	 	arrow.style.transform = "rotate(0deg)";
	}
}