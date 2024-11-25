const { createUser } = require("../server-modules/database");

module.exports = async function (req, res, page) {

    if (req.method == "GET") {
        new page.loader({
            res: res,
            req: req,
            title: "Register",
            content: `${__dirname}/../pages/users/register.html`,
            other: {

            },
        }).load();
        return
    }

    if (req.method == "POST") {
        const { username, password } = req.body;

        const newUser = await createUser(username, password)

        /*res.json({
            "ok": true,
            "body": req.body
        })*/

        res.json(newUser)
    }
};
