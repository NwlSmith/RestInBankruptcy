const fetchURL = 'http://3.144.16.89:8080/dynamoDB/docs/'

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

const addData = (companies) => {
    let elements = []
    companies.forEach((companyData, index) => {
        let company = document.createElement('div')
        company.classList.add("company")

        let basic = document.createElement('div')
        basic.classList.add("basic")

        company.appendChild(basic)

        let left = document.createElement('div')
        left.classList.add("left")

        let titleH4 = document.createElement('h4')
        titleH4.textContent = companyData[1].title

        basic.appendChild(left)
        left.appendChild(titleH4)

        let right = document.createElement('div')
        right.classList.add("right")

        let flowers = document.createElement('div')
        flowers.classList.add("flowers")

        let flowerLogo = document.createElement('img')
        flowerLogo.classList.add("flowerLogo")
        let flowerNum = `flower${index}`
        flowerLogo.setAttribute("id", flowerNum)
        flowerLogo.src = './images/flower.png'

        let flowerH5 = document.createElement('h5')
        flowerH5.textContent = companyData[0].flowers

        // flowerLogo.addEventListener("click",()=>{
        //     addFlower(flowerNum)
        // })

        basic.appendChild(right)
        right.appendChild(flowers)
        flowers.appendChild(flowerLogo)
        flowers.appendChild(flowerH5)

        let comments = document.createElement('div')
        comments.classList.add("comments")

        let letterLogo = document.createElement('img')
        letterLogo.classList.add("letterLogo")
        letterLogo.src = './images/letter.png'
        

        let letterH5 = document.createElement('h5')
        letterH5.textContent = companyData[0].comments.length

        right.appendChild(comments)
        comments.appendChild(letterLogo)
        comments.appendChild(letterH5)

        let arrow = document.createElement('img')
        arrow.classList.add("arrow")
        let arrowNum = `arrow${index}`
        let detailNum = `details${index}`
        arrow.setAttribute("id", arrowNum)
        arrow.src = 'images/arrow.png'

        arrow.addEventListener("click",()=>{
            expand(arrowNum, detailNum)
        })
        
        right.appendChild(arrow)
        
        let details = document.createElement('div')
        details.classList.add("details")
        details.setAttribute("id", detailNum)

        company.appendChild(details)

        let info1 = document.createElement('div')
        info1.classList.add("info")

        let category1 = document.createElement('div')
        category1.classList.add("category")
        
        let category1H5 = document.createElement('h5')
        category1H5.textContent = "Survival Dates"

        let content1 = document.createElement('div')
        content1.classList.add("content")
        
        let content1P = document.createElement('p')
        content1P.textContent = `${companyData[1].DateIncorporated ? companyData[1].DateIncorporated.slice(0, 10) : companyData[1].dateIssued.slice(0, 10)} - ${companyData[1].lastModified.slice(0, 10)}`
        
        details.appendChild(info1)
        info1.appendChild(category1)
        category1.appendChild(category1H5)
        info1.appendChild(content1)
        content1.appendChild(content1P)

        let info2 = document.createElement('div')
        info2.classList.add("info")

        let category2 = document.createElement('div')
        category2.classList.add("category")

        let category2H5 = document.createElement('h5')
        category2H5.textContent = "Revenue"

        let content2 = document.createElement('div')
        content2.classList.add("content")

        let content2P = document.createElement('p')
        content2P.textContent = `${companyData[1].revenue_range}`
        
        details.appendChild(info2)
        info2.appendChild(category2)
        category2.appendChild(category2H5)
        info2.appendChild(content2)
        content2.appendChild(content2P)

        let info3 = document.createElement('div')
        info3.classList.add("info")

        let category3 = document.createElement('div')
        category3.classList.add("category")

        let category3H5 = document.createElement('h5')
        category3H5.textContent = "Employees"

        let content3 = document.createElement('div')
        content3.classList.add("content")

        let content3P = document.createElement('p')
        content3P.textContent = `${companyData[1].employees_range}`
        
        details.appendChild(info3)
        info3.appendChild(category3)
        category3.appendChild(category3H5)
        info3.appendChild(content3)
        content3.appendChild(content3P)

        let info4 = document.createElement('div')
        info4.classList.add("info")

        let category4 = document.createElement('div')
        category4.classList.add("category")

        let category4H5 = document.createElement('h5')
        category4H5.textContent = "Description"

        let content4 = document.createElement('div')
        content4.classList.add("content")

        let content4P = document.createElement('p')
        content4P.textContent = `${companyData[1].description? companyData[1].description : companyData[1].naics_description? companyData[1].naics_description : "Company description not currently available."} `
        
        details.appendChild(info4)
        info4.appendChild(category4)
        category4.appendChild(category4H5)
        info4.appendChild(content4)
        content4.appendChild(content4P)

        elements.push(company)
    })
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
        elements = addData(companyDets)
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
        let sortEls = addData(sorted)
        for(let i = 0; i < containerChildren.length; i++) {
            compContainer.replaceChild(sortEls[i], containerChildren[i])
        }
    },
    sortTime: () => {
        let sorted = companyDets.sort((a,b) => {
            let aSurvival = Date.parse(a[1].lastModified.slice(0, 10)) - Date.parse(a[1].DateIncorporated ? a[1].DateIncorporated.slice(0, 10) : (a[1].dateIssued.slice(0, 10)))
            let bSurvival = Date.parse(b[1].lastModified.slice(0, 10)) - Date.parse(b[1].DateIncorporated ? b[1].DateIncorporated.slice(0, 10) : (b[1].dateIssued.slice(0, 10)))
            if(aSurvival && !bSurvival) {
                return -1
            } else if(!aSurvival && bSurvival) {
                return 1
            } else if(aSurvival > bSurvival) {
                return -1
            } else if(aSurvival < bSurvival) {
                return 1
            } else {
                return 0
            }
        })
        let sortEls = addData(sorted)
        for(let i = 0; i < containerChildren.length; i++) {
            compContainer.replaceChild(sortEls[i], containerChildren[i])
        }
    },
    sortSize: () => {
        let sorted = companyDets.sort((a,b) => {
            let aRange = a[1].employees_range
            let bRange = b[1].employees_range

            if(aRange && !bRange) {
                return -1
            } else if(!aRange && bRange) {
                return 1
            } else if(!aRange && !bRange) {
                return 0
            } else if(aRange == "> 10,000") {
                return -1
            } else if(bRange == "> 10,000") {
                return 1
            } else {
                aRange = aRange.split("-");
                bRange = bRange.split("-");
                
                if (aRange[0].includes(",")) aRange[0] = aRange[0].replace(',', "")
                if (aRange[1].includes(",")) aRange[1] = aRange[1].replace(',', "")
                if (bRange[0].includes(",")) bRange[0] = bRange[0].replace(',', "")
                if (bRange[1].includes(",")) bRange[1] = bRange[1].replace(',', "")

                if (aRange[1] > bRange[1]) {
                    return -1
                } else if(aRange[1] < bRange[1]) {
                    return 1
                } else {
                    return 0
                }
            }
        })
        let sortEls = addData(sorted)
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
            run.sortTime()
            break
        case "size":
            run.sortSize()
            break
    }
}
