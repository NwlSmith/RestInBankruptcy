const fetchURL = 'http://18.220.179.6:8080/dynamoDB/docs/'

const compiledCompDets = () => {
    let companyDetails = []
    try {
        fetch(fetchURL + 'RestInDatabase/courtState/New%20York', { 
            method: "GET" 
        }).then(res => 
            res.json()
        ).then(companies => {
            for(let comp of companies) {
                fetch(fetchURL + 'GravestoneOfferings/packageId/' + comp.packageId, { 
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

const companies = compiledCompDets()
console.log(companies)

let compContainer = document.getElementsByClassName("list-container")

