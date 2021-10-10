const { rmdir } = require('fs');

const deleteFolder = (folderName) => {
    /* eslint-disable no-console */
    return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(null);
        });
    });
    /* eslint-disable no-console */
};

module.exports = { deleteFolder };
