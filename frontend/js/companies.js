const fetchURL = 'http://18.220.179.6:8080/dynamoDB/docs/'

const compContainer = document.getElementById("list-container")
const containerChildren = compContainer.children
const loadingEl = document.createElement('div')
loadingEl.classList.add("lds-circle")
loadingEl.insertAdjacentHTML('beforeend', '<div>R.i.B</div>')
compContainer.appendChild(loadingEl)
let companyDets
let elements

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

const compElements = (companies) => {
    let elements = []
    for(let comp of companies) {
        let el = document.createElement('div')
        el.classList.add('company')
        let template = `
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
            </div>`
        el.insertAdjacentHTML("beforeend", template.trim())
        elements.push(el)
    }
    return elements
}

const insertElements = (eles, container) => {
    let docfrag = document.createDocumentFragment()
    for(let el of eles) {
        docfrag.appendChild(el)
    }
    loadingEl.classList.add("hidden")
    compContainer.addEventListener("transitionend", () => {
        container.appendChild(docfrag)
        compContainer.removeChild(loadingEl)
    })
    compContainer.removeEventListener("transitionend", () => {
        container.appendChild(docfrag)
        compContainer.removeChild(loadingEl)
    })
}

const run =  {
    run: async () => {
        companyDets = await compiledCompDets()
        elements = compElements(companyDets)
        insertElements(elements, compContainer)
    },
    sortPop: () => {
        let sorted = companyDets.sort((a,b) => {
            if(a[0].flowers > b[0].flowers) {
                return -1
            } else if(a[0].flowers < b[0].flowers) {
                return 1
            } else {
                return 0
            }
        })
        let sortEls = compElements(sorted)
        for(let i = 0; i < containerChildren.length; i++) {
            compContainer.replaceChild(sortEls[i], containerChildren[i])
        }
    }
}

run.run()

const sortHandler = () => {
    let sortSelector = document.getElementById("sortSelect")
    switch(sortSelector.value) {
        case "popular":
            run.sortPop()
            break
        case "survival":
            console.log("survival")
            break
        case "size":
            console.log("size")
            break
    }
}