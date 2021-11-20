const fetchURL = 'http://18.220.179.6:8080/dynamoDB/docs/'

const compiledCompDets = async () => {
    let companyDetails = []
    try {
        await fetch(fetchURL + 'RestInDatabase/courtState/New%20York', { 
            method: "GET" 
        }).then(res => 
            res.json()
        ).then(async companies => {
            for(let comp of companies) {
                await fetch(fetchURL + 'GravestoneOfferings/packageId/' + comp.packageId, { 
                    method: 'GET'
                }).then(res =>
                    res.json()
                ).then(details => {
                    companyDetails.push([details[0], comp])
                })
            }
        })
    } catch (e) {
        console.log(e)
    }
    return companyDetails
}

let compContainer = document.getElementById("list-container")

const insertComps = () => {
    compiledCompDets().then(companies => {
        for(let comp of companies) {
            let template = `
            <div class="company">
                <div class="basic">
                    <div class="left">
                        <h4>${comp[1].title}</h4>
                    </div>
                    <div class="right">
                        <div class="flowers">
                            <img src="images/flower.png" width="50px" height="70px">
                            <h5>${comp[0].flowers}</h5>
                        </div>
                        <div class="comments">
                            <img src="images/letter.png" width="65px" height="65px">
                            <h5>${comp[0].comments.length}</h5>
                        </div>
                        <img src="images/arrow.png" width="30px" height="30px" style="transform: rotate(0deg)" id="arrow" onclick="expand()">
                    </div>
                </div>
                <div id="details">
                    <div class="info">
                        <div class="category">
                            <h5>Survival Dates</h5>
                        </div>
                        <div class="content">
                            <p>${comp[1].DateIncorporated ? comp[1].DateIncorporated : comp[1].dateIssued} - ${comp[1].lastModified}</p>
                        </div>
                    </div>
                    <div class="info">
                        <div class="category">
                            <h5>Revenue</h5>
                        </div>
                        <div class="content">
                            <p>${comp[1].revenue_range}</p>
                        </div>
                    </div>
                    <div class="info">
                        <div class="category">
                            <h5>Employee</h5>
                        </div>
                        <div class="content">
                            <p>${comp[1].employees_range}</p>
                        </div>
                    </div>
                    <div class="info">
                        <div class="category">
                            <h5>Description</h5>
                        </div>
                        <div class="content">
                            <p>${comp[1].description}</p>
                        </div>
                    </div>
                </div>
            </div>
            `
            compContainer.insertAdjacentHTML('beforeend', template)
        }
    })
}

insertComps()