const { rmdir } = require('fs')

const deleteFolder = (folderName) => {
    console.log('deleting folder %s', folderName)

    return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve(null)
        })
    })
}

module.exports = { deleteFolder }
