
const execSync = require('child_process').execSync;

console.log("Building with 'ng build --configuration=INATrace-dev'")
execSync("ng build --configuration=INATrace-dev")
console.log("Extract english translations from 'dist/INATrace-dev/*.js'")
execSync("npx locl extract -s=dist/INATrace-dev/*.js -f=json -o=src/assets/locale/en.json");
console.log("Translations are stored in 'src/assets/locale/en.json'")


const localeFolder = './src/assets/locale/';
const fs = require('fs');
const enLocaleFile = './src/assets/locale/en.json';
const enLocale = 'en';
var path = require('path');
const ext = '.json';
var enJSON = JSON.parse(fs.readFileSync(enLocaleFile));

console.log("Writing new translation keys in other locale .json files")
var JSONfiles = fs.readdirSync(localeFolder).filter(file =>  path.extname(file).toLowerCase() === ext)
JSONfiles.forEach(file => {
  var json = JSON.parse(fs.readFileSync(localeFolder+file));

  if(json.locale != enLocale) {
    Object.entries(enJSON.translations).forEach(
      ([key, value]) => {
        if (!json.translations.hasOwnProperty(key)) {
          json.translations[key] = value;
        }

      }
    );
    let outputJSON = JSON.stringify(json, null, 2);
    fs.writeFileSync(localeFolder + file, outputJSON);
  }


})


console.log("Clearing unused key-values")
var JSONfiles = fs.readdirSync(localeFolder).filter(file => path.extname(file).toLowerCase() === ext)
JSONfiles.forEach(file => {
  var json = JSON.parse(fs.readFileSync(localeFolder + file));
  if (json.locale != enLocale) {
    Object.entries(json.translations).forEach(
      ([key, value]) => {
        if (!enJSON.translations.hasOwnProperty(key)) {
          json.translations[key] = undefined;
        }
      }
    );
    json = JSON.parse(JSON.stringify(json));
    let outputJSON = JSON.stringify(json, null, 2);
    fs.writeFileSync(localeFolder + file, outputJSON);
  }

})

