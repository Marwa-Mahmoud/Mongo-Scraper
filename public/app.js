var pageReload = function(){
    $(".article-container").empty();
    $.get('/').done(function(data){
        console.log("page reload");
    })
}


$('#scrape-new').on('click', function(event){
    event.preventDefault();
    $.getJSON('/scrape')
    .done(function(data){
        console.log(data);        
        pageReload();
        
    })
})

$(document).on("click", "#btn-save", function() {
    console.log("save button is clicked")
    $.ajax({
        method: "POST",
        url: "/saved-articles",
        data: {
          title: $(this).siblings('a').text(),
          link: $(this).siblings('a').attr('href'),
          summary: $(this).parent().siblings('div.summary').text(),
          
        }
      })
        // With that done
        .done(function(data) {
          // Log the response
          console.log(data);
          //pageReload();
        });
});
    