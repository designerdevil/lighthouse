module.exports = {
    events: {
        deployment: 'deployment',
        view: 'view',
        generate: 'generate'
    },
    types: {
        azure: 'azure',
        gcp: 'gcp'
    },
    baseURL: {
        azure: 'https://storagetestgm.blob.core.windows.net/',
        gcp: 'https://storage.googleapis.com/'
    }
}