function createArticle() {
    const reqTitle = document.getElementById("title").value;
    const reqText = document.getElementById("text").value;
    const reqAuthor = document.getElementById("author").value;
    const date = new Date();
    const currDate = '' + date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const req = {
        'id': -1,
        'title': reqTitle,
        'text': reqText,
        'author': reqAuthor,
        'date': currDate,
        'comments': []
    }
    const httpReq = new XMLHttpRequest();
    httpReq.open('POST', '/api/articles/create', true);
    httpReq.onreadystatechange = () => alert('Article created!');
    httpReq.send(JSON.stringify(req));
}