function getCookie(cookie, name) {
    if (cookie.includes(name+"=") == false || name == "") return ""
    var result = cookie.slice(cookie.indexOf(name))
    if (result.includes(";")) result = result.slice(0, result.indexOf(";"))
    result = result.split("=")
    return result[result.length-1]
}

module.exports = async function(req, res, data) {
    let newOther = {
        user_username: "Guest"
    }



    return {
        other: {
            ...data.other,
            ...newOther
        }
    }
}
//let theme = getCookie(req.headers.cookie, "theme")
//if (theme == "silly") base = fs.readFileSync(`${__dirname}/../../templates/silly.html`).toString()