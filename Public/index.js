function loadArticles() {
    const field = document.querySelector('#field').value;
    const order = document.querySelector('#order').value;
    if (!field) field = "date";
    if (!order) order = "asc";
    sort = {
        "sortField": field,
        "sortOrder": order,
        "page": "0",
        "limit": "5",
        "includeDeps": false
    };
    let httpReq = new XMLHttpRequest();
    httpReq.open('POST', '/api/articles/readall', true);
    httpReq.onreadystatechange = req;
    httpReq.send(JSON.stringify(sort));
}


function GetArticles(result) {
    const articles = result.items.map(article =>
        `
        <div>
            <div>${article.title}</div>
            <div>${article.text}</div>
            <div>
                <div>${article.date}</div>
                <div>${article.author}</div>
            </div>
        </div>
        `
    );
    return articles;
}

function req() {
    if (this.readyState === 4 && this.status === 200) {
        const result = JSON.parse(this.responseText);
        const articles = GetArticles(result);
        document.querySelector('#Articles').innerHTML = articles;
    }
}