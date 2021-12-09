const fetchURL = 'http://3.144.16.89:8080/dynamoDB/docs/'

const compContainer = document.getElementById("list-container")
const containerChildren = compContainer.children
const loadingEl = document.createElement('div')
loadingEl.classList.add("lds-circle")
loadingEl.insertAdjacentHTML('beforeend', '<div>R.i.B</div>')
let companyDets
let elements

const compiledCompDets = async (stateName) => {
    let encodedName = stateName.split(" ").join("%20")
    let companyDetails = []
    try {
        await fetch(fetchURL + `RestInDatabase/courtState/${encodedName}`, { 
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


        //main info div
        
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

        flowerLogo.addEventListener("click",()=>{
            expandFlower(overlay, index)
        })

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

        letterLogo.addEventListener("click",()=>{
            expandComment(overlay, index)
        })

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
        
        //expanded info div

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

        //overlay

        let overlay = document.createElement('div')
        overlay.classList.add("overlayOFF")

        let flowerDetails = document.createElement('div')
        flowerDetails.classList.add("flowerDetailsHide")
        let flowerDetailsNum = `flowerDetails${index}`
        flowerDetails.setAttribute("id", flowerDetailsNum)
        
        company.appendChild(overlay)
        overlay.appendChild(flowerDetails)

        let flowerCloseImage = document.createElement('img')
        flowerCloseImage.classList.add("closeImage")

        let flowerCloseNum = `flowerClose${index}`
        flowerCloseImage.setAttribute("id", flowerCloseNum)
        flowerCloseImage.src = './images/close.png'

        flowerCloseImage.addEventListener("click",()=>{
            hideFlower(overlay, index)
        })

        let flowerRecieved = document.createElement('div')
        flowerRecieved.classList.add("flowerRecieved")

        let flowerImage = document.createElement('img')
        flowerImage.classList.add("flowerImage")
        flowerImage.src = './images/flower.png'

        let flowerRecievedH2 = document.createElement('h2')
        flowerRecievedH2.textContent = "Flowers recieved: "

        flowerDetails.appendChild(flowerCloseImage)
        flowerDetails.appendChild(flowerRecieved)
        flowerRecieved.appendChild(flowerImage)
        flowerRecieved.appendChild(flowerRecievedH2)

        let flowerDetailsH1 = document.createElement('h1')
        flowerDetailsH1.textContent = "Send Flowers"


        let flowerNumIterator = document.createElement('div')
        flowerNumIterator.classList.add("flowerNumIterator")

        let count = 0;
        let flowerNum1 = document.createElement('p')
        flowerNum1.textContent = "-"

        let flowerNum2 = document.createElement('p')
        flowerNum2.textContent = count;

        let flowerNum3 = document.createElement('p')
        flowerNum3.textContent = "+"

        flowerNum1.addEventListener("click",()=>{
            if (count > 1) count--;
            flowerNum2.textContent = count;
        })

        flowerNum3.addEventListener("click",()=>{
            if (count < 10)count++;
            flowerNum2.textContent = count;
        })

        let flowerSendButton = document.createElement('button')
        flowerSendButton.textContent = "Send"
        let buttonNum = `flowerSendButton${index}`
        flowerSendButton.setAttribute("id", buttonNum)

        flowerSendButton.addEventListener("click",()=>{
            let pkgId = `${companyData[1].packageId}`
            addFlower(pkgId, count)

            flowerH5.textContent = Number(flowerH5.textContent) + count
            hideFlower(overlay, index)
        })

        flowerDetails.appendChild(flowerDetailsH1)
        flowerDetails.appendChild(flowerNumIterator)
        flowerNumIterator.appendChild(flowerNum1)
        flowerNumIterator.appendChild(flowerNum2)
        flowerNumIterator.appendChild(flowerNum3)
        flowerDetails.appendChild(flowerSendButton)

        let commentDetails = document.createElement('div')
        commentDetails.classList.add("commentDetailsHide")
        let commentDetailsNum = `commentDetails${index}`
        commentDetails.setAttribute("id", commentDetailsNum)
        
        overlay.appendChild(commentDetails)

        let commentCloseImage = document.createElement('img')
        commentCloseImage.classList.add("closeImage")

        let commentCloseNum = `commentClose${index}`
        commentCloseImage.setAttribute("id", commentCloseNum)
        commentCloseImage.src = './images/close.png'

        commentCloseImage.addEventListener("click",()=>{
            hideComment(overlay, index)
        })

        let commentsH1 = document.createElement('h1')
        commentsH1.textContent = "Comments"

        let exisitingComments = document.createElement('div')
        exisitingComments.classList.add("existingComments")

        commentDetails.appendChild(commentCloseImage)
        commentDetails.appendChild(commentsH1)
        commentDetails.appendChild(exisitingComments)

        for (let i = 0; i < companyData[0].comments.length; i++){
            let exisitingCommentsComment = document.createElement('div')
            exisitingCommentsComment.classList.add("comment")

            let commentsP = document.createElement('p')
            commentsP.textContent = `${companyData[0].comments[i]}`
            
            exisitingComments.appendChild(exisitingCommentsComment)
            exisitingCommentsComment.appendChild(commentsP)
        }
        

        let commentsH2 = document.createElement('h2')
        commentsH2.textContent = "Leave your comment"

        let commentsTextArea = document.createElement('textarea')
        
        let commentsTANum = `commentsTA${index}`
        commentsTextArea.setAttribute("id", commentsTANum)
        
        let commentSendButton = document.createElement('button')
        commentSendButton.textContent = "Send"
        let commentButtonNum = `commentSendButton${index}`
        commentSendButton.setAttribute("id", commentButtonNum)

        commentSendButton.addEventListener("click",()=>{
            let comment = document.getElementById(commentsTANum).value.trim();
            let pkgId = `${companyData[1].packageId}`
            if(comment != ''){
                addComment(pkgId, comment)

                let exisitingCommentsComment = document.createElement('div')
                exisitingCommentsComment.classList.add("comment")

                let commentsP = document.createElement('p')
                commentsP.textContent = `${comment}`
                
                exisitingComments.appendChild(exisitingCommentsComment)
                exisitingCommentsComment.appendChild(commentsP)

                letterH5.textContent = Number(letterH5.textContent) + 1
                document.getElementById(commentsTANum).value = ""
            }
            
        })

        commentDetails.appendChild(commentsH2)
        commentDetails.appendChild(commentsTextArea)
        commentDetails.appendChild(commentSendButton)


        // <!-- <div class="commentDetails">
        //     <img class="close" src="images/close.png">
        //     <h1>Comments</h1>
        //     <div class="existingComments">
        //         <div class="comment">
        //              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. </p>
        //          </div>
        //     </div>
        //     <h2>Leave your comment</h2>
        //     <textarea></textarea>
        //     <button>Send</button>
        // </div> -->
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
        compContainer.removeChild(compContainer.firstElementChild)
    }, {once: true})
}

const clearElements = (container) => {
    while(container.firstChild) {
        container.removeChild(container.lastChild)
    }
}

const runState = async (stateName) => {
    clearElements(compContainer)
    compContainer.appendChild(loadingEl)
    loadingEl.classList.remove("hidden")
    companyDets = await compiledCompDets(stateName)
    elements = addData(companyDets)
    insertElements(elements, compContainer)
}

const run =  {
    run: async () => {
        runState("New York")
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

const stateHandler = () => {
    let stateSelector = document.getElementById("stateSelect")
    runState(stateSelector.value)
}
