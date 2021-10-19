const { rmdir } = require('fs');

const deleteFolder = (folderName) => {
    return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

module.exports = { deleteFolder };
