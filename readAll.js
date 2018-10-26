let articles = require('./articles.json');
const log = require('./log');
let sort;

function compareDate(a, b) {
    let myDateA = a.split('-');
    let myDateB = b.split('-');
    let dateA = new Date(parseInt(myDateA[2]), parseInt(myDateA[1]), parseInt(myDateA[0]));
    let dateB = new Date(parseInt(myDateB[2]), parseInt(myDateB[1]), parseInt(myDateB[0]));
    return dateA - dateB;
}

function compareNumbers(a, b) {
    return a - b;
}

function compareStrings(a, b) {
    return a.localeCompare(b);
}

function sortById(article1, article2) {
    const param1 = article1.id;
    const param2 = article2.id;
    return compareNumbers(param1, param2);
}

function sortByTitle(article1, article2) {
    const param1 = article1.title;
    const param2 = article2.title;
    return compareStrings(param1, param2);
}

function sortByText(article1, article2) {
    const param1 = article1.text;
    const param2 = article2.text;
    return compareStrings(param1, param2);
}

function sortByDate(article1, article2) {
    const param1 = article1.date;
    const param2 = article2.date;
    return compareDate(param1, param2);
}

function sortByAuthor(article1, article2) {
    const param1 = article1.author;
    const param2 = article2.author;
    return compareStrings(param1, param2);
}

const sortFuncs = {
    'id': sortById,
    'title': sortByTitle,
    'text': sortByText,
    'date': sortByDate,
    'author': sortByAuthor
}

function SortArticles(sort) {
    const sortFunction = sortFuncs[sort.sortField];
    const sorted = articles.sort(sortFunction);
    if (sort.sortOrder === 'desc') {
        sorted.reverse();
    }
    return sorted;
}

function makeResultObject(sortedArticles, sort) {
    const articlesCount = sortedArticles.length;
    const page = parseInt(sort.page);
    const limit = parseInt(sort.limit);
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    const resultArticles = sortedArticles.slice(startIndex, endIndex);
    const result = {
        "items": resultArticles,
        "meta": {
            "page": sort.page,
            "pages": articlesCount / sort.limit,
            "count": articlesCount,
            "limit": sort.limit
        }
    }
    return result;
}

function readAll(req, res, payload, cb) {
    log.log('/api/articles/readall', payload);
    sort = payload;
    if (!sort) sort = {
        "sortField": "date",
        "sortOrder": "desc",
        "page": "0",
        "limit": "10",
        "includeDeps": false
    };
    let sortedArticles = SortArticles(sort);
    const articlesResult = [];
    if (!sort.includeDeps) {
        for (let article of sortedArticles) {
            const comentless = Object.assign({}, article);
            comentless.comments = null;
            articlesResult.push(comentless);
        }
    }
    const result = makeResultObject(articlesResult, sort);

    cb(null, result, 'application/json');
}
exports.readAll = readAll;