import axios from 'axios'

const getPackage = async (pkg, apikeystring) => {
    let pkgdata = await axios.get(pkg.packageLink + apikeystring).then(async (response) => {
        let currentPkg = response.data
        if(currentPkg.courtState == "New York") {
            let newPackage = {}
            newPackage["title"] = currentPkg.title
            newPackage["packageId"] = currentPkg.packageId
            newPackage["dateIssued"] = currentPkg.dateIssued
            newPackage["lastModified"] = currentPkg.lastModified
            newPackage["courtState"] = currentPkg.courtState
            return newPackage
        } else {
            return null
        }
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
        let business = /\bllc\b|\bcorp\b|\bco\b|\binc\b/i.test(pkg.title)
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
        let pkgTitle = pkg.title.replace("&", "%26").replace(",", "")
        try {
            let nyData = await axios.get(`https://data.ny.gov/resource/n9v6-gdp6.json?$where=current_entity_name like '%25${pkgTitle.toUpperCase()}%25'`)
            let ORBData = await axios.get(`https://api.orb-intelligence.com/3/match/?api_key=${process.env.ORB_KEY}&name=${pkgTitle}&country=US&state=NY`)
            if(nyData.data.length > 0) {
                pkg["DateIncorporated"] = nyData.data[0].initial_dos_filing_date
            }
            if(ORBData.data.results[0]) {
                let industryORB = await axios.get(ORBData.data.results[0].fetch_url)
                pkg["naics_description"] = industryORB.data.naics_description
                pkg["sic_description"] = industryORB.data.sic_description
                pkg["employees_range"] = industryORB.data.employees_range
                pkg["employees"] = industryORB.data.employees
                pkg["revenue_range"] = industryORB.data.revenue_range
            }
        } catch (e) {
            return e
        }
    }
    return pkgArray
}

export { getPackage, filterPackages, bolsterPackageData }