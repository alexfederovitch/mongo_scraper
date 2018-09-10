// $(document).ready(function() {
//     let articleContainer = S(".article-container");
//     $(document).on("click", ".btn-save", articleSaved);
//     $(document).on("click", ".scrape-now", articleScraped);

//     initPage();

//    function initPage() {
//        articleContainer.empty();
//        $.get("/api/headlines?saved=false")
//        .then(function(data) {
//            if (data && data.length) {
//                renderArticles(data);
//            }
//            else {
//                renderEmpty();
//            }
//        });
//    } 
//    function renderArticles(articles) {
//        let articlePanels = [];

//        for (let i=0; i < articles.length; i++) {
//            articlePanels.push(createPanel(articles[i]));
//        }
//    }
//    function createPanel(article) {
//        let panel = 
//        $(["<div class='panel panel-default'></div>"])
//    }
// });