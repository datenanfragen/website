export function fetchCompanyDataBySlug(slug, callback) {
    try {
        fetch(BASE_URL + 'db/' + slug + '.json')
            .then(res => res.json()).then(json => {callback(json)});
    } catch(error) {
        console.error(error.message); // TODO: Proper Error Handling
    }
}

export function fetchCompanyNameBySlug(slug, callback) {
    fetchCompanyDataBySlug(slug, (json) => {callback(json['name'])});
}
