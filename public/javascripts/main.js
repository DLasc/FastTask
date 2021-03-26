

function openForm(){
    document.getElementById('replyForm').style.display='block';
}

function closeForm(){
    document.getElementById('replyForm').style.display='none';
}

function openReplies(){
    document.getElementById('replyDisplay').style.display='block';
}

function closeReplies(){
    document.getElementById('replyDisplay').style.display='none';
}


$('document').ready(function(){
    $('#nextreply').click(function(){
        if ($('#replyimage').is(':visible')){
            $.ajax(window.location.pathname + '/nextreply', {
                // dataType: 'json',
                success: function(result, status, xhr){
                    // console.log(result);
                    // console.log(status)
                    // console.log(xhr)
                    if (result.replies[0]){
                        $('#replyparagraph').html(result.replies[0].textcontent);
                        $('#replyimage').show()
                        $('#replyimage').attr('src', result.replies[0].filepath);
                    }
                    else{
                        $('#replyparagraph').html('');
                        $('#replyimage').hide()
                        // $('#replyimage').attr('src', 'data:');
                    }
                    
                }
            })
        }
        else {
            window.location.replace(window.location.pathname)
        }
        
    })
})