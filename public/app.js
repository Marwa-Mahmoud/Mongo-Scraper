$(".scrap-new").on("click", function(event){
    $.get("/scrape", function(data){
        $(".article-container").append("<h1>"+data+"</h1>");
    })
})