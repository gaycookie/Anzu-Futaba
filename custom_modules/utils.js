const unicodeNumbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]

function prettifyDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m > 9 ? m : (h ? '0' + m : m || '0'), s > 9 ? s : '0' + s,].filter(a => a).join(':');
}

function prettifyNumber(value) {
    var thousand = 1000;
    var million = 1000000;
    var billion = 1000000000;
    var trillion = 1000000000000;
    if (value < thousand) {
        return String(value);   
    }
    if (value >= thousand && value <= 1000000) {
         return  Math.round(value/thousand) + 'k';   
    }
    if (value >= million && value <= billion) {
        return Math.round(value/million) + 'M';   
    }
    if (value >= billion && value <= trillion) {
        return Math.round(value/billion) + 'B';   
    }
    else {
        return Math.round(value/trillion) + 'T';   
    }
}

module.exports.unicodeNumbers   = unicodeNumbers
module.exports.prettifyDuration = prettifyDuration;
module.exports.prettifyNumber   = prettifyNumber;