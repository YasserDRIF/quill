var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Drive = {};
var async = require('async');
// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata',
    'https://www.googleapis.com/auth/drive'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs.json';

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, path, name) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    var code = '4/bb0WhkwGsMFTNzIMdVpBSPmRxxYycS0RsLuu222QY0s';
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client,path,name);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}
/**
 * Upload a pdf to google drive
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function _uploadCV(auth, path, name) {

    
    var folderId = '1xzizwWEUvnsQSyMl6oEfg2oeSRy8eRoK';

    var service = google.drive('v3');

    var pageToken = null;

    // Using the NPM module 'async'
    async.doWhilst(function (callback) {
        service.files.list({
            q: "mimeType='application/pdf', name=" + name,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageToken: pageToken
        }, function (err, res) {
            if (err) {
                console.error(err);
                callback(err)
            } else {
                res.files.forEach(function (file) {
                    console.log('Found file: ', file.name, file.id);
                    exist = file.id;
                    return;
                });
                pageToken = res.nextPageToken;
                callback();
            }
        });
    }, function () {
        return !!pageToken;
    }, function (err) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            // All pages fetched
        }
    })

    const fileMetadata = {
        name: name,
        parents: [folderId]
    };

    const media = {
        mimeType: 'application/pdf',
        body: path
    };


    
    service.files.create({
        auth: auth,
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.id);
        }
    });
}

/**
 * Upload a pdf to google drive
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function _uploadReceipt(auth, path, name) {
    var folderId = '1xzizwWEUvnsQSyMl6oEfg2oeSRy8eRoK';

    var service = google.drive('v3');

    var pageToken = null;

    // Using the NPM module 'async'
    async.doWhilst(function (callback) {
        service.files.list({
            q: "mimeType='application/pdf', name=" + name,
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive',
            pageToken: pageToken
        }, function (err, res) {
            if (err) {
                console.error(err);
                callback(err)
            } else {
                res.files.forEach(function (file) {
                    console.log('Found file: ', file.name, file.id);
                    exist = file.id;
                    return;
                });
                pageToken = res.nextPageToken;
                callback();
            }
        });
    }, function () {
        return !!pageToken;
    }, function (err) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            // All pages fetched
        }
    })

    const fileMetadata = {
        name: name,
        parents: [folderId]
    };

    const media = {
        mimeType: 'application/pdf',
        body: path
    };

    service.files.create({
        auth: auth,
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.id);
        }
    });
}

/**
 * Upload a pdf to google drive
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
Drive.uploadCV = function (path, name) {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Drive API.
        var credentials = JSON.parse(content);
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        console.log("Samayikoum");
        
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                getNewToken(oauth2Client, _uploadCV, path, name);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                _uploadCV(oauth2Client, path, name);
            }
        });
    });
}

/**
 * Upload a pdf to google drive
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
Drive.uploadReceipt = function (path, name) {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        if (err) {
            console.log('Error loading client secret file: ' + err);
            return;
        }
        // Authorize a client with the loaded credentials, then call the
        // Drive API.
        var credentials = JSON.parse(content);
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                getNewToken(oauth2Client, _uploadReceipt, path, name);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                _uploadReceipt(oauth2Client, path, name);
            }
        });
    });
}

module.exports = Drive;