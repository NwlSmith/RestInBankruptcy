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

async function addData() {
    const listContainer = document.getElementById('list-container')
    compiledCompDets().then(data => {
        data.forEach((companyData, index) => {
            console.log(companyData)

            const company = document.createElement('div')
            company.classList.add("company")

            const basic = document.createElement('div')
            basic.classList.add("basic")

            listContainer.appendChild(company)
            company.appendChild(basic)

            const left = document.createElement('div')
            left.classList.add("left")

            const titleH4 = document.createElement('h4')
            titleH4.textContent = companyData[1].title

            basic.appendChild(left)
            left.appendChild(titleH4)

            const right = document.createElement('div')
            right.classList.add("right")

            const flowers = document.createElement('div')
            flowers.classList.add("flowers")

            const flowerLogo = document.createElement('img')
            flowerLogo.classList.add("flowerLogo")
            flowerLogo.src = './images/flower.png'
            
            const flowerH5 = document.createElement('h5')
            flowerH5.textContent = companyData[0].flowers

            basic.appendChild(right)
            right.appendChild(flowers)
            flowers.appendChild(flowerLogo)
            flowers.appendChild(flowerH5)

            const comments = document.createElement('div')
            comments.classList.add("comments")

            const letterLogo = document.createElement('img')
            letterLogo.classList.add("letterLogo")
            letterLogo.src = './images/letter.png'
            

            const letterH5 = document.createElement('h5')
            letterH5.textContent = companyData[0].comments.length

            right.appendChild(comments)
            comments.appendChild(letterLogo)
            comments.appendChild(letterH5)

            const arrow = document.createElement('img')
            arrow.classList.add("arrow")
            const arrowNum = `arrow${index}`
            const detailNum = `details${index}`
            arrow.setAttribute("id", arrowNum)
            arrow.src = 'images/arrow.png'

            arrow.addEventListener("click",()=>{
                expand(arrowNum, detailNum)
            })
            
            right.appendChild(arrow)
            
            const details = document.createElement('div')
            details.classList.add("details")
            details.setAttribute("id", detailNum)

            company.appendChild(details)

            const info1 = document.createElement('div')
            info1.classList.add("info")

            const category1 = document.createElement('div')
            category1.classList.add("category")
            
            const category1H5 = document.createElement('h5')
            category1H5.textContent = "Survival Dates"

            const content1 = document.createElement('div')
            content1.classList.add("content")
            
            const content1P = document.createElement('p')
            content1P.textContent = `${companyData[1].DateIncorporated ? companyData[1].DateIncorporated.slice(0, 10) : companyData[1].dateIssued.slice(0, 10)} - ${companyData[1].lastModified.slice(0, 10)}`
            
            details.appendChild(info1)
            info1.appendChild(category1)
            category1.appendChild(category1H5)
            info1.appendChild(content1)
            content1.appendChild(content1P)

            const info2 = document.createElement('div')
            info2.classList.add("info")

            const category2 = document.createElement('div')
            category2.classList.add("category")

            const category2H5 = document.createElement('h5')
            category2H5.textContent = "Revenue"

            const content2 = document.createElement('div')
            content2.classList.add("content")

            const content2P = document.createElement('p')
            content2P.textContent = `${companyData[1].revenue_range}`
            
            details.appendChild(info2)
            info2.appendChild(category2)
            category2.appendChild(category2H5)
            info2.appendChild(content2)
            content2.appendChild(content2P)

            const info3 = document.createElement('div')
            info3.classList.add("info")

            const category3 = document.createElement('div')
            category3.classList.add("category")

            const category3H5 = document.createElement('h5')
            category3H5.textContent = "Employees"

            const content3 = document.createElement('div')
            content3.classList.add("content")

            const content3P = document.createElement('p')
            content3P.textContent = `${companyData[1].employees_range}`
            
            details.appendChild(info3)
            info3.appendChild(category3)
            category3.appendChild(category3H5)
            info3.appendChild(content3)
            content3.appendChild(content3P)

            const info4 = document.createElement('div')
            info4.classList.add("info")

            const category4 = document.createElement('div')
            category4.classList.add("category")

            const category4H5 = document.createElement('h5')
            category4H5.textContent = "Description"

            const content4 = document.createElement('div')
            content4.classList.add("content")

            const content4P = document.createElement('p')
            content4P.textContent = `${companyData[1].description? companyData[1].description : companyData[1].naics_description? companyData[1].naics_description : "Company description not currently available."} `
            
            details.appendChild(info4)
            info4.appendChild(category4)
            category4.appendChild(category4H5)
            info4.appendChild(content4)
            content4.appendChild(content4P)
        })
    })
}

addData();