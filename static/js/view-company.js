var params = new URLSearchParams(window.location.search);
var slug = params.get('slug');

if(slug) {
    var url = 'https://raw.githubusercontent.com/datenanfragen/companies/master/data/' + slug + '.json';

    fetch(url)
        .then(res => res.json())
        .then(data => { displayCompanyInfo(data) })
        .catch(err => { document.getElementById('company-details').innerHTML = '<p>Ungültige Daten empfangen. Das bedeutet wahrscheinlich, dass das angefragte Unternehmen nicht in der Datenbank vorhanden ist.</p>'; throw err; });
}

function displayCompanyInfo(data) {
    if(!data.name) {
        document.getElementById('company-details').innerHTML = '<p>Ungültige Daten empfangen.</p>';
    }

    var html = '<h2>' + data.name + '</h2>';
    if(data.categories) html += '<p><strong>Kategorien:</strong> ' + data.categories.join(', ') + '</p>';
    if(data.runs) {
        html += '<p><strong>Betreibt auch:</strong><ul>';
        data.runs.forEach(element => { html += '<li>' + element + '</li>' });
        html += '</ul></p>';
    }
    if(data.address) html += '<p><strong>Adresse:</strong><br>' + nl2br(data.address) + ' </p>';
    if(data.phone | data.fax | data.email | data.web) html += '<p>';
    if(data.phone) html += '<strong>Telefon:</strong> ' + data.phone + '<br>';
    if(data.fax) html += '<strong>Fax:</strong> ' + data.fax + '<br>';
    if(data.email) html += '<strong>E-Mail:</strong> ' + data.email + '<br>';
    if(data.web) html += '<strong>Webseite:</strong> ' + data.web;
    if(data.phone | data.fax | data.email | data.web) html += '</p>';
    if(data.sources) {
        html += '<p><strong>Quellen:</strong><ul>';
        data.sources.forEach(source => { html += '<li><a href="' + source + '">' + source + '</a></li>' });
        html += '</ul></p>';
    }
    if(data.comments) {
        html += '<p><strong>Hinweise:</strong><ul>';
        data.comments.forEach(comment => { html += '<li>' + comment + '</li>' });
        html += '</ul></p>';
    }

    document.getElementById('company-details').innerHTML = html;
}

// see https://stackoverflow.com/a/7467863
function nl2br(str) {
    if (typeof str === 'undefined' || str === null) return '';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
}
