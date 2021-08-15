var fs = require('fs');
const http = require('http');
const https = require('https');
// const got = require('got');
var child_process = require('child_process');

var swagger_docs_url = 'http://localhost:5000/static/swagger.json'
var apiFolder = 'src/api-chain'
var protocol = swagger_docs_url.startsWith('https') ? https : http;

function afterBuild(code) {
  if (code == 0) {
    fs.unlinkSync(`${ apiFolder }/index.ts`);
    fs.unlinkSync(`${ apiFolder }/api/api.ts`);
    fs.unlinkSync(`${ apiFolder }/model/models.ts`);
    console.log("Conversion successful.");
  } else {
    console.error("Conversion finished with status ", code);
  }
}

function processSwaggerJson(verbose = false) {
  let fname = `${ apiFolder }/apidocs.json`
  let originalFname = `${ apiFolder }/apidocs-original.json`
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
    for (let name of allNames) {
      if (!dic[name]) {
        dic[name] = 1
      } else {
        console.log("DUPLICATE: " + name)
      }
    }
    throw Error("Duplicate operationId")
  }

  // All routes for file download must be processed like this.
  data.paths["/chain-api/data/document/download/{storageKey}"]["get"]["responses"]["200"]["content"] = {
    "*/*": {
      "schema": {
        "format": "binary",
        "type": "string"
      }
    }
  };

  // povozi popravek
  outputJSON = JSON.stringify(data, null, 2);
  outputJSON = outputJSON.replace(/\"format\": \"byte\"/g, '"format": "binary"')
  fs.writeFileSync(fname, outputJSON);
}


async function refreshFromSpec() {
  if (!fs.existsSync(`${ apiFolder }`)) {
    fs.mkdirSync(`${ apiFolder }`);
  }

  const file = fs.createWriteStream(`${ apiFolder }/apidocs.json`);
  const request = protocol.get(swagger_docs_url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close();
      processSwaggerJson();
      // generate TS API
      var proc = child_process.fork("node_modules/openapi-typescript-angular-generator/bin/ng-ts-codegen.js", ['-i', 'src/api-chain/apidocs.json', '-o', 'src/api-chain']);
      proc.on('exit', afterBuild);
    });
  });
}


console.log("Generating from: " + swagger_docs_url);
refreshFromSpec()
// processSwaggerJson()
// if (!fs.existsSync(`${ apiFolder }`)) {
//   fs.mkdirSync(`${ apiFolder }`);
// }
// // generate TS API
// var proc = child_process.fork("node_modules/openapi-typescript-angular-generator/bin/ng-ts-codegen.js", ['-i', 'src/api-chain/apidocs.json', '-o', 'src/api']);
// proc.on('exit', afterBuild);



