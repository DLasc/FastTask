

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

    // $('#navprofilepic').click(function(){
    //     $('#dropdown').toggle()
    // })
    $('#openreply').click(function(){
        $.ajax(window.location.pathname + '/openreply', {
            success: function(result, status, xhr){
                if (result.replies){
                    $('#replyparagraph').html(result.replies.textcontent);
                    if (result.filepath){
                        $('#replyimage').show()
                        $('#replyimage').attr('src', result.replies.filepath);
                    }
                    else { $('#replyimage').hide()}
                }
                else{
                    $('#replyparagraph').html('');
                    $('#replyimage').hide()
                    // $('#replyimage').attr('src', 'data:');
                }
            }
        })
    })

    $('#choosereply').click(function(){
        $.ajax(window.location.pathname + '/choosereply', {
            success: function(result, status, xhr){
                if (result.done){
                    $('#nextreply').hide()
                    $('#choosereply').hide()
                }
                
            }
        })



    })
    //nextreply function
    $('#nextreply').click(function(){
        if ($('#replyimage').is(':visible')){
            $.ajax(window.location.pathname + '/nextreply', {
                // dataType: 'json',
                success: function(result, status, xhr){
                    // console.log(result);
                    // console.log(status)
                    // console.log(xhr)
                    if (result.replies){
                        $('#replyparagraph').html(result.replies.textcontent);
                        if (result.filepath){
                            $('#replyimage').show()
                            $('#replyimage').attr('src', result.replies.filepath);
                        }
                        else { $('#replyimage').hide()}
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