var fs = require('fs');
var child_process = require('child_process');

var args = process.argv.slice(2);

const replace = require('replace-in-file');

function pretvori(match, bumpVersion) {
    let verzija = match.match(/version *: *\'([^\']*)\'/)[1]
    let mtc = verzija.match(/(\d+)\.(\d+)\.(\d+)( *\- *([^ ]*))?/)
    if (!mtc) {
        console.log("Wrong version string: '" + verzija + "'.")
        throw Error()
    }
    let major = Number(mtc[1])
    let minor = Number(mtc[2])
    let patch = Number(mtc[3])
    if (isNaN(major) || major < 0 || isNaN(minor) || minor < 0 || isNaN(patch) || patch < 0) {
        console.log("Wrong version string: '" + verzija + "'.")
        throw Error()
    }
    let timestamp = (new Date()).toISOString();
    let res = null
    switch (bumpVersion) {
        case 'patch':
            res = `${ major }.${ minor }.${ patch + 1 } - ${ timestamp }`
            break;
        case 'minor':
            res = `${ major }.${ minor + 1 }.${ 0 } - ${ timestamp }`
            break;
        case 'major':
            res = `${ major + 1 }.${ 0 }.${ 0 } - ${ timestamp }`
            break;
        default:
            throw Error("Wrong bumpVersion: '" + bumpVersion + "'")
    }
    return `version: '${ res }'`

}

if (args.length == 0) {
    console.log("Usage: \nnpm run update-version file [bump-version]\n\nbump version can be major, minor or patch (default).")
    throw Error()
}

let bumpVersion = 'patch'
if (args.length == 2) {
    bumpVersion = args[1]
    if (['major', 'minor', 'patch'].indexOf(bumpVersion) < 0) {
        console.log("Invalid version")
        throw Error()
    }
}

const options = {
    files: args[0],
    from: /version *: *\'[^\']*\'/g,
    to: (match) => pretvori(match, bumpVersion)
};


try {
    const results = replace.sync(options);
    console.log('Replacement results:', results);
}
catch (error) {
    console.error('Error occurred:', error);
}

