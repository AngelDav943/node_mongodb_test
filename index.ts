const express = require('express');
const fs = require('fs');
const app = express();
const http = require('http').Server(app);
const page = require('angeldav-loaderhtml');

page.url = "http://localhost:80"
page.default.template = `${__dirname}/templates/base.html`
page.default.notfound = `${__dirname}/pages/error.html`

page.default.preload = `${__dirname}/preload.js`

page.default.other = {
	templateheader: `${__dirname}/public/components/navigator.html`
};

app.use('/public', express.static('public'));

const pageloader = require(`angeldav-pageloader`)(page, {
    "app": app,
    "path": `${__dirname}/view`
})

http.listen(80, () => {
	console.log('server started');
});