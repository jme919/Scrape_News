$(document).ready(function(){
    var articleContainer = $(".card-content");
    $(document).on("click", ".save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
//run init page function once the page is ready
    initPage();

    function initPage() {
        //Empty the article container, run an ajax request for any unsave articles
        articleContainer.empty();
        $.get("/api/headlines?saved=false")
            .then(function(data){
                //If there are new headlines, render them to the page
                if(data && data.length){
                    renderArticles(data);
                }
                else{
                    //instead render a message explaining there are no articles
                    renderEmpty();
                }
            });
        
    }

    function renderArticles(articles){
        //handles appending html containing article data to the page
        var articleCards = [];
        for(var i = 0; i< articles.length; i++){
            articleCards.push(createCards(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createCards(article){
        var card = 
            $(["<div class='columns'>",
                "<div class='column'>",
                "<div class='card'>",
                "<div class='card-content has-text-centered'>",
                "<span class='icon is-medium'>",
                "<i class='fas fa-lg fa-newspaper'>", "</i>",
                "</span>",

                "<h2 class='title' id='headline'>", article.headline, "</h2>",
                "<h3 class='subtitle' id='summary'>", article.summary, "</h3>",
                "<a href='' class='button '>", "Go To The Source", "</a>",
                "<a href='' class='button save'>", "Save For Later", "</a>",

                "</div>",
                "</div>",
                "</div>",
                "</div>"

        ].join(""));
        
        card.data("_id", article._id);
        return card;
    }

    function renderEmpty(){
        var emptyAlert = 
            $(["<div class='columns'>",
                "<div class='column'>",
                "<div class='card'>",
                "<div class='card-content has-text-centered'>",
                "<span class='icon is-medium'>",
                "<i class='fas fa-lg fa-newspaper'>", "</i>",
                "</span>",

                "<h2 class='title' id='headline'>", "Whoops, there are no new articles", "</h2>",
                "<h3 class='subtitle' id='summary'>", "What would you like to do?", "</h3>",
                "<a href='/saved' class='button is-large>","Go To Saved Articles","</a>",
                "<a class='button is-large scrape-new'>","Try to Scrape Again","</a>",

                "</div>",
                "</div>",
                "</div>",
                "</div>"

        ].join(""));
        articleContainer.append(emptyAlert);
    }

    function handleArticleSave(){
        var articleToSave = $(this).parents(".card").data();
        articleToSave.saved = true;

        $ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data){
            if(data.ok){
                initPage();
            }
        });
    }

    function handleArticleScrape(){
        $.get("/api/fetch")
         .then(function(data){
            initPage();
            bootbox.alert("<h3 class= 'text-is-centered'>" + data.message + "</h3");
        });
    }
});