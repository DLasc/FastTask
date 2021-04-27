

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
    $('#reply').submit(function(e){
        // console.log('posting reply')
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: window.location.pathname + '/reply',
            type: 'POST',
            data: formData,
            success: function(result, status, xhr){
                if (result.success){
                    closeForm();
                    $('.replythankyou').show();
                    $('#openreplyform').hide();
                }
            },
            cache: false,
            contentType: false,
            processData: false
        })
    })
    // $('#navprofilepic').click(function(){
    //     $('#dropdown').toggle()
    // })
    $('#openreply').click(function(){
        $.ajax(window.location.pathname + '/openreply', {
            success: function(result, status, xhr){
                console.log(result.reply)
                if (result.reply){
                    $('#replyparagraph').html(result.reply.textcontent);
                    if (result.reply.filepath !== '/images/null'){
                        $('#replyimage').show()
                        $('#replyimage').attr('src', result.reply.filepath);
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
        // if ($('#replyimage').is(':visible')){
        $.ajax(window.location.pathname + '/nextreply', {
            // dataType: 'json',
            success: function(result, status, xhr){
                // console.log(result);
                // console.log(status)
                // console.log(xhr)
                if (result.replies){
                    $('#replyparagraph').html(result.replies.textcontent);
                    if (result.replies.filepath !== '/images/null'){
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
})