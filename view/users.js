const database = require(`../server-modules/database.js`);

module.exports = async function (req, res, page) {
    const data = await database.listUsers();

    console.log("data");
    console.dir(data);

    let users_htmlcontent = "";
    if (data) {
        for (const user of data) {

            users_htmlcontent += new page.templater({
                content: `${__dirname}/../public/components/test.html`,
                other: {
                    name: user.name,
                    description: "0",
                },
            }).load();
        }
    }

    new page.loader({
        res: res,
        req: req,
        title: "User list",
        content: `${__dirname}/../pages/users/users.html`,
        other: {
            content: users_htmlcontent
        },
    }).load();

}
