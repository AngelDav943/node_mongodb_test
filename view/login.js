const { loginUser } = require("../server-modules/database");

module.exports = async function (req, res, page) {

    if (req.method == "GET") {
        new page.loader({
            res: res,
            req: req,
            title: "Login",
            content: `${__dirname}/../pages/users/login.html`,
            other: {

            },
        }).load();
        return
    }

    if (req.method == "POST") {
        const { username, password } = req.body;
        
        const loginData = await loginUser(username, password);

        res.json(loginData)
    }
};
