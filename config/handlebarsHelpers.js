module.exports = {
    numformat: function(number){
        return number.toLocaleString();
    },

    dateformat: function(unixtimestamp){
        date = new Date(unixtimestamp)
        return date.toLocaleString();
    },
}