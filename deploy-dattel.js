/* eslint-disable no-console */
const dattel = require('dattel-client')({
    server_url: process.env.DATTEL_SERVER,
    auth_token: process.env.DATTEL_TOKEN,
});
const path = require('path');

if (!process.env.DATTEL_SERVER || !process.env.DATTEL_TOKEN) {
    console.error('Missing configuration. Please set the DATTEL_SERVER and DATTEL_TOKEN environment variables.');
    process.exit(1);
}

async function main() {
    try {
        const languages = ['de', 'en', 'fr', 'pt', 'es', 'hr'];

        for (const language of languages) {
            const site_id = `dade-website-${language}`;

            // Cancel any stale deploys. This call will fail if there was no stale deploy, so we just ignore the error.
            await dattel.cancelDeploy(site_id).catch((_) => {});

            console.log(`Starting dattel deploy for ${site_id}…`);
            const deploy_info = (await dattel.startDeploy(site_id)).data.deploy;

            console.log(`Uploading files for ${site_id}…`);
            await dattel.deployDirectory(
                site_id,
                deploy_info.id,
                deploy_info.files,
                path.join(__dirname, 'public', language)
            );

            console.log(`Publishing deploy for ${site_id}…`);
            await dattel.publishDeploy(site_id, deploy_info.id);

            console.log(`Setting headers and redirects for ${site_id}…`);
            await dattel.setSiteHeadersFromFile(site_id, path.join(__dirname, '_headers'), null);

            console.log(`Done with ${site_id}`);
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
