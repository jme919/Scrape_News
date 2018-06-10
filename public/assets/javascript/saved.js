$(document).ready(function(){
    var articleContainer = $(".card-content");

    $(document).on("click",".delete", handleArticleDelete);
    $(document).on("click",".notes", handleArticleNotes);
    $(document).on("click", ".save", handleNoteSave);
    $(document).on("click", ".note-delete", handleNoteDelete);

    initPage();

    function initPage(){
        articleContainer.empty()
        $.get("/api/headlines?saved=true").then(function(data){
            if(data && data.length){
                renderArticles(data);
            } else{
                renderEmpty();
            }
        });
    }

    function renderArticles(articles) {
        //handles appending html containing article data to the page
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(createCards(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function createCards(article) {
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

    function renderEmpty() {
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
                "<a href='/saved' class='button is-large>", "Go To Saved Articles", "</a>",
                "<a class='button is-large scrape-new'>", "Try to Scrape Again", "</a>",

                "</div>",
                "</div>",
                "</div>",
                "</div>"

            ].join(""));
        articleContainer.append(emptyAlert);
    }

    function renderNotesList(data){
        var notesToRender = [];
        var currentNote;
        if(!data.notes.length){
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this article yet.",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);

        }
        else{
            for(var i = 0; i < data.notes.length; i++){
                currentNote = $([
                    "<li class = 'list-group-item note'>",
                    data.notes[i].note.Text,
                    "<a class= 'button is large note-delete'>x</a>",
                    "</li>"
                ].join(""));

                currentNote.childdren("button").data("_id", data.notes[i]._id);
                notesToRender.push(currentNotes);
            }
        }
        $(".notes-container").append(notesToRender);
    }

    function handleArticleDelete(){
        var articleToDelete = $(this).parents(".card").data();
        $ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data){
            if(data.ok){
                initPage;
            }
        });
    }
    
    function handleArticleNotes(){
        var currentArticle = $(this).parents(".card").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data){
            var modalText = ["<div class='card-content has-text-centered'>",
                "<span class='icon is-medium'>",
                "<i class='fas fa-lg fa-newspaper'>", "</i>",
                "</span>","<h2>Notes for Article: ",
                currentArticle._id, "</h2>",
              
                "<textarea class= 'bootbox-body textarea placeholder= 'New Note' rows='4' cols='60'>", "</textarea>",
                "<a  class='button save is-large>", " Save Article", "</a>",
                ,

                "</div>",

            ].join("");
            bootbox.dialog({
                message:modalText,
                closeButton: true
            });
            $(".save").data("article", noteData);

            renderNotesList(noteData);
        });
    }

    function handleNoteSave(){
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if(newNote){
            noteData ={
                _id:$(this).data("article")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete(){
        var noteToDelet = $(this).data("_id");

        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function(){
            bootbox.hideAll();
        });
    }

});