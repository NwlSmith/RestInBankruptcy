import axios from 'axios'

const getPackage = async (pkg, apikeystring) => {
    let pkgdata = await axios.get(pkg.packageLink + apikeystring).then(async (response) => {
        let currentPkg = response.data
        let newPackage = {}
        newPackage["title"] = currentPkg.title
        newPackage["packageId"] = currentPkg.packageId
        newPackage["dateIssued"] = currentPkg.dateIssued
        newPackage["lastModified"] = currentPkg.lastModified
        newPackage["courtState"] = currentPkg.courtState
        return newPackage
    })
    .catch(e => {
        return e
    })
    return pkgdata
}

const filterPackages = async (pkgArray) => {
    let filteredpackages = []
    for(let pkg of pkgArray) {
        let id = pkg.packageId.split("-").includes("bk")
        let business = /\bllc\b|\bcorp\b|\bco\b|\binc\b|\bltd\b|\blimited\b|\bcompany\b|\blp\b|\bn.a.\b|\binc\b|\bfoundation\b|\bbank\b|\bcorporation\b|\bincorporated\b|\bllp\b|\bpt\b|\bfund\b|\bn.t.\b|\bchurch\b|\btrust\b|\bservices\b/i.test(pkg.title)
        let apistring = "?api_key=" + process.env.GOVAPIKEY
        if(id && business) {
            let getdata = getPackage(pkg, apistring)
            filteredpackages.push(getdata)
        }
    }
    return Promise.all(filteredpackages).then(values => {
        return values
    })
}

const bolsterPackageData = async (pkgArray) => {
    for(let pkg of pkgArray) {
        try {
            let nyData
            if(pkg.courtState == "New York") {
                nyData = await axios.get(`https://data.ny.gov/resource/n9v6-gdp6.json?$where=current_entity_name like '%25${pkg.title.toUpperCase().replace("&", "%26").replace(" ", "%25").replace(","|"LLC"|"CORP"|"CO"|"INC", "")}%25'`, {
                    headers: {
                        "X-App-Token": process.env.NY_DATA_KEY
                    }
                })
            }
            let ORBData = await axios.get(`https://api.orb-intelligence.com/3/match/?api_key=${process.env.ORB_KEY}&name=${pkg.title}&country=US&state=${pkg.courtState.replace(" ", "%20")}`)
            if(nyData && nyData.data.length > 0) {
                pkg["DateIncorporated"] = nyData.data[0].initial_dos_filing_date
            }
            if(ORBData.data.results[0]) {
                let industryORB = await axios.get(ORBData.data.results[0].fetch_url)
                pkg["naics_description"] = industryORB.data.naics_description
                pkg["sic_description"] = industryORB.data.sic_description
                pkg["employees_range"] = industryORB.data.employees_range
                pkg["employees"] = industryORB.data.employees
                pkg["revenue_range"] = industryORB.data.revenue_range
                pkg["description"] = industryORB.data.description
            }
        } catch (e) {
            return e
        }
    }
    return pkgArray
}

export { getPackage, filterPackages, bolsterPackageData }