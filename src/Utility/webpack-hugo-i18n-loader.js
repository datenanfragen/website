const path = require('path');

module.exports = function(content) {
    const data = JSON.parse(content);
    if (data.hugo) {
        this.emitFile('../i18n/' + path.basename(this.resource), JSON.stringify(data.hugo));
    }

    return content;
};
