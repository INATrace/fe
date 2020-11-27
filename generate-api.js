var fs = require('fs');
var converter = require('api-spec-converter');
var child_process = require('child_process');

var swagger_docs_host = ''


// var swagger_docs_host = null
const patchDir = './patches'
const modelsDir = './src/api/model'

function patch(source, targetDir) {
    fs.copyFile(patchDir + '/' + source, targetDir + '/' + source, (err) => {
        if (err) throw err;
        console.log(source + ' was copied to ' + targetDir);
    });
}

function afterBuild(code) {
    if (code == 0) {
        fs.unlinkSync('src/api/index.ts');
        fs.unlinkSync('src/api/api/api.ts');
        fs.unlinkSync('src/api/model/models.ts');
        console.log("Conversion successful.");
    } else {
        console.error("Conversion finished with status ", code);
    }
}

if (swagger_docs_host === null) {
    console.log("Generating from: tmp_apisprout.yaml");
    var proc = child_process.fork("node_modules/openapi-typescript-angular-generator/bin/ng-ts-codegen.js", ['-i', 'tmp_apisprout.yaml', '-o', 'src/api']);
    proc.on('exit', afterBuild);
} else {
    console.log("Generating form: " + swagger_docs_host);
    converter.convert({
        from: 'swagger_2',
        to: 'openapi_3',
        source: swagger_docs_host,
    }).then(function (converted) {
        // [Optional] Fill missing fields with dummy values
        converted.fillMissing();
        delete converted.spec.info.license;


        // [Optional] Validate converted spec
        converted.validate().then(function (result) {
            //fs.writeFileSync('apidocs-new.json', converted.stringify());

            if (result.errors)
                return console.error(result.errors);
            if (result.warnings)
                console.warn(result.warnings);

            if (!fs.existsSync('src/api')) {
                fs.mkdirSync('src/api');
            }

            fs.writeFileSync('src/api/apidocs.json', converted.stringify());

            // preimenovanje funkcij
            processSwaggerJson(true)

            // generate TS API
            var proc = child_process.fork("node_modules/openapi-typescript-angular-generator/bin/ng-ts-codegen.js", ['-i', 'src/api/apidocs.json', '-o', 'src/api']);
            proc.on('exit', afterBuild);
        });
    });
}


function processSwaggerJson(verbose = false) {
  let fname = 'src/api/apidocs.json'
  let originalFname = 'src/api/apidocs-original.json'
  let rawdata = fs.readFileSync(fname);
  let data = JSON.parse(rawdata);

  // shrani original
  let outputJSON = JSON.stringify(data, null, 2);
  fs.writeFileSync(originalFname, outputJSON);

  let allowedActions = ['get', 'put', 'delete', 'post', 'head', 'options', 'patch']


  for (let path in data.paths) {
    // console.log(path)
    for (let action in data.paths[path]) {
      if (allowedActions.indexOf(action) < 0) {
        console.log(path)
        console.log(action)
        throw Error("Strange action: " + action)
      }
      let currentOpId = data.paths[path][action].operationId
      let newOpId = currentOpId.replace(/(.*)UsingPOST\_\d$/, "\$1")
                              .replace(/(.*)UsingGET\_\d$/, "\$1")
                              .replace(/(.*)UsingPUT\_\d$/, "\$1")
                              .replace(/(.*)UsingDELETE\_\d$/, "\$1")
                              .replace(/(.*)UsingHEAD\_\d$/, "\$1")
                              .replace(/(.*)UsingOPTIONS\_\d$/, "\$1")
                              .replace(/(.*)UsingPATCH\_\d$/, "\$1")
      data.paths[path][action].operationId = newOpId
      if (verbose) {
        console.log(path)
        console.log(action)
        console.log(currentOpId + "   ->   " + newOpId)
      }
    }
  }

  let allNames = []

  for (let path in data.paths) {
    for (let action in data.paths[path]) {
      let controllers = data.paths[path][action].tags
      let currentOpId = data.paths[path][action].operationId
      controllers.forEach(x => {
        let ident = x + "." + currentOpId
        console.log("OPPP: " + ident)
        allNames.push(ident)
      })
    }
  }

  let allNamesSet = new Set(allNames)

  if (allNames.length != allNamesSet.size) {
    let dic = {}
    for(let name of allNames) {
      if(!dic[name]) {
        dic[name] = 1
      } else {
        console.log("DUPLICATE: " + name)
      }
    }
    throw Error("Duplicate operationId")
  }


  // povozi popravek
  outputJSON = JSON.stringify(data, null, 2);
  outputJSON = outputJSON.replace(/\"format\": \"byte\"/g, '"format": "binary"')
  fs.writeFileSync(fname, outputJSON);
}
