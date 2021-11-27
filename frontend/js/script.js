function expand(arrowIndex, detailNum){
	var arrow = document.getElementById(arrowIndex);
	var details = document.getElementById(detailNum);

	if (arrow.classList.contains("arrow")){
		details.classList.remove("details")
		details.classList.add("detailsShow")
		arrow.classList.remove("arrow")
		arrow.classList.add("arrowUp")
	}
	else{
		details.classList.remove("detailsShow")
		details.classList.add("details")
		arrow.classList.remove("arrowUp")
		arrow.classList.add("arrow")
	}
}

