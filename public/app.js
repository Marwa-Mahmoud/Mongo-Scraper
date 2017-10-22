// var pageReload = function(){
//     //$(".article-container").empty();
//     $.get('/home').done(function(data){
//         console.log("page reload");
//     })
// }


$('#scrape-new').on('click', function(event){
    $.getJSON('/scrape')
    .done(function(data){
        console.log(data);  
        window.location.assign("/");      
    })
})

$(document).on("click", "#btn-save", function() {
    console.log("save button is clicked")
    var thisId = $(this).siblings('input').attr('data-id');
    $.ajax({
        method: "POST",
        url: "/saved-articles/" + thisId,
        data: {
          title: $(this).siblings('a').text(),
          link: $(this).siblings('a').attr('href'),
          summary: $(this).parent().siblings('div.summary').text(),
          
        }
      })
        // With that done
        .done(function(data) {
          // Log the response
          //console.log(data);
         location.reload();
        });
});

$(document).on("click", "#btn-article-delete", function() {
    var thisId = $(this).siblings('input').attr("data-id");
    
    $.get('/saved-articles/'+thisId).done(function(data){
        location.reload();
    })
    
    
})

//pageReload();
    