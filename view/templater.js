module.exports = async function (req, res, page) {
    var htmlcontent = "";

    for (let i = 1; i <= 100; i++) {
        let element = "";
        if (i % 3 == 0) element += "fizz";
        if (i % 5 == 0) element += "buzz";
        if (element == "") element = i.toString();
        htmlcontent += new page.templater({
            content: `${__dirname}/../public/components/test.html`,
            other: {
                name: i,
                description: element,
            },
        }).load();
    }

    new page.loader({
        res: res,
        req: req,
        title: "Sum of numbers",
        content: `${__dirname}/../pages/templater.html`,
        other: {
            content: htmlcontent,
        },
    }).load();
};
