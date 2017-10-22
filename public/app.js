
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
   
        .done(function(data) {
         location.reload();
        });
});

$(document).on("click", "#btn-article-delete", function() {
    var thisId = $(this).siblings('input').attr("data-id");
    
    $.get('/saved-articles/'+thisId).done(function(data){
        location.reload();
    })
    
    
})

$(document).on("click", "#btn-article-note", function(event) {
    
    console.log("article note button pressed");
    var thisId = $(this).siblings('input').attr("data-id");

    $.get('/saved-notes/'+thisId)
        .done(function(data){
            console.log(data.note)
            $('#article-notes').append(data.note)
            $('#article-id').text(thisId)
        })
})

$(document).on("click", "#btn-save-note", function() {
    var thisId = $('#article-id').text();
    var data = {body: $('#new-note').val()};

    $.post('/saved-notes/'+thisId, data)
        .done(function(data){
            console.log(data);
        })
})




    