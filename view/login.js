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
        console.log("new register!!")
        res.json({
            "ok": true,
            "body": req.body
        })
    }
};
