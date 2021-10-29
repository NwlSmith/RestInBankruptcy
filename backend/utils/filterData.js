import axios from 'axios'

const getPackage = async (pkg, apikeystring) => {
    let pkgdata = await axios.get(pkg.packageLink + apikeystring).then(response => {
        return response.data
    }).catch(e => {
        return e
    })
    return pkgdata
}

const filterPackages = async (pkgArray) => {
    let filteredpackages = []
    pkgArray.forEach(pkg => {
        let id = pkg.packageId.split("-").includes("bk")
        let business = /\bllc\b|\bcorp\b|\bco\b|\binc\b/i.test(pkg.title)
        let apistring = "?api_key=" + process.env.GOVAPIKEY
        if(id && business) {
            let getdata = getPackage(pkg, apistring)
            filteredpackages.push(getdata)
        }
    })
    return Promise.all(filteredpackages).then(values => {
        return values
    })
}

export { getPackage, filterPackages }