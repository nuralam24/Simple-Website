// const fs = require('fs');

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOUt = `The file is wirting : ${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output2.txt', textOUt);

//console.log(`Data is wirting`);

const fs = require('fs');
const http = require('http');
const url = require('url');
//const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard= fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

//const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
//console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    
    // Overview Page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const cardHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);
    } 
    // Product Page
    else if(pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    // Api
    else if(pathname === '/api') {
        //fs.readFile('./dev-data/data.json');
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            res.writeHead(200, {
                'Content-type': 'application/json'
            });
            res.end(data);
        });
    }
    // Not found 
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello world'
        });
        res.end('<h1> Page not Found </h1>');
    }
});


server.listen(8000, () => console.log('Server is running on port 8000'));

