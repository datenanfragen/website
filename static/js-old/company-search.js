var client = algoliasearch('M90RBUHW3U', 'a306a2fc33ccc9aaf8cbe34948cf97ed');
var index = client.initIndex('companies');

var algolia_autocomplete = autocomplete('#aa-search-input', { hint: false, debug: true }, {
    source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
    displayKey: 'name',
    templates: {
        suggestion: function(suggestion) {
            return '<span><strong>' + suggestion._highlightResult.name.value + '</strong></span>'
                + (suggestion._highlightResult.runs ? '<br><span>betreibt auch: ' + suggestion._highlightResult.runs.map(e => e.value).join(', ') + '</span>' : '')
                + (suggestion._highlightResult.categories ? '<br><span>' + suggestion._highlightResult.categories.map(e => e.value).join(', ') + '</span>' : '');
        },
        footer: '<div class="algolia-branding"><img src="/img/search-by-algolia.svg"></div>'
    }
});
