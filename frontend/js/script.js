const putUrl = 'http://3.144.16.89:8080/dynamoDB/doc/'

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

function addComment(pkgId, comment) {
	fetch(putUrl + "comments", {
		method: "PUT",
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			keyObj: {
				packageId: pkgId
			},
			comment: comment
		})
	}).catch(e => console.log(e))
}


function addFlower(pkgId, flowerNum) {
	fetch(putUrl + `flowers/${flowerNum}`, {
		method: "PUT",
		headers: {
			'Content-Type': "application/json"
		},
		body: JSON.stringify({
			keyObj: {
				packageId: pkgId
			}
		})
	}).catch(e => console.log(e))
}
