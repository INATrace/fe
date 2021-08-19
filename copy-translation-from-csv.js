const csvFile = './src/assets/locale/Coffee-translations.csv'; //copy from google sheets
const fs = require('fs')
const readline = require('readline');

const localeFolder = './src/assets/locale/';
const enLocaleFile = './src/assets/locale/en.json';
const deLocaleFile = './src/assets/locale/de.json';
const esLocaleFile = './src/assets/locale/es.json';
const rwLocaleFile = './src/assets/locale/rw.json';

var enJSON = JSON.parse(fs.readFileSync(enLocaleFile));
var deJSON = JSON.parse(fs.readFileSync(deLocaleFile));
var esJSON = JSON.parse(fs.readFileSync(esLocaleFile));
var rwJSON = JSON.parse(fs.readFileSync(rwLocaleFile));

const readTranslations = readline.createInterface({
  input: fs.createReadStream(csvFile),
  output: process.stdout,
  terminal: false
});

readTranslations.on('line', (line) => {
  splitLine = line.split(';');

  id = splitLine[0];
  en = splitLine[1];
  de = splitLine[2];
  es = splitLine[3];
  rw = splitLine[4];

  let enData = enJSON.translations;
  let rwData = rwJSON.translations;
  let deData = deJSON.translations;
  let esData = esJSON.translations;

  if (en) enData[id] = en;
  if (de) deData[id] = de;
  if (es) esData[id] = es;
  if (rw) rwData[id] = rw;

  let outputJSONen = JSON.stringify(enJSON, null, 2);
  fs.writeFileSync(enLocaleFile, outputJSONen);

  let outputJSONde = JSON.stringify(deJSON, null, 2);
  fs.writeFileSync(deLocaleFile, outputJSONde);

  let outputJSONes = JSON.stringify(esJSON, null, 2);
  fs.writeFileSync(esLocaleFile, outputJSONes);

  let outputJSONrw = JSON.stringify(rwJSON, null, 2);
  fs.writeFileSync(rwLocaleFile, outputJSONrw);

});
