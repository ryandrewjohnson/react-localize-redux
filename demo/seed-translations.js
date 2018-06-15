const writeJsonFile = require('write-json-file');
const loremIpsum = require('lorem-ipsum');

const translationCount = 10000;
const translations = {};
const translationsForLanguage = {};
const languages = ['EN', 'FR', 'ES'];

for (let i = 0; i < translationCount; i++) {
  translations[`key-${i}`] = languages.map(lang => `${lang} - ${loremIpsum()}`);
}

languages.forEach(lang => {
  for (let i = 0; i < translationCount; i++) {
    translationsForLanguage[lang] === undefined
      ? (translationsForLanguage[lang] = { [`key-${i}`]: loremIpsum() })
      : (translationsForLanguage[lang][`key-${i}`] = loremIpsum());
  }
});

Object.keys(translationsForLanguage).forEach(key => {
  writeJsonFile(
    `./src/translations/${key.toLowerCase()}.seed-translations.json`,
    translationsForLanguage[key]
  ).then(() => {
    console.log(`translations created for ${key}!`);
  });
});

writeJsonFile('./src/translations/seed-translations.json', translations).then(
  () => {
    console.log('translations created!');
  }
);
