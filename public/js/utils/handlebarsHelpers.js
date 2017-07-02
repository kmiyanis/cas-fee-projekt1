Handlebars.registerHelper('stars', function(n, block) {
    let accum = '';

    for(let i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});


Handlebars.registerHelper('dateFromNow', function dateFromNow(context, block) {
    let s = block.hash.suffix || false;
    return moment(context).calendar(null, {
        sameElse: '[irgendwann]'
    }).split(' ')[0];
});


Handlebars.registerHelper('dateFormat', function(context, block) {
    if (window.moment) {
        let f = block.hash.format || "MMM DD, YYYY hh:mm:ss A";
        return moment(context).format(f);
    }else{
        return context;
    }
});


Handlebars.registerHelper('breaklines', function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
    return new Handlebars.SafeString(text);
});