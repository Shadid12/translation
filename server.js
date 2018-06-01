import express from 'express';
import {sync as globSync} from 'glob';
import {readFileSync} from 'fs';
import * as path from 'path';
import serialize from 'serialize-javascript';

const app = express()

const translations = globSync('./lang/*.json')
    .map((filename) => [
        path.basename(filename, '.json'),
        readFileSync(filename, 'utf8'),
    ])
    .map(([locale, file]) => [locale, JSON.parse(file)])
    .reduce((collection, [locale, messages]) => {
        collection[locale] = messages;
        return collection;
    }, {});

app.get('/', (req, res) => {
    let locale   = req.query.locale || 'en-UPPER';
    let messages = translations[locale];
    if (!messages) {
        return res.status(404).send('Locale is not supported.');
    }
    res.send(`${serialize({locale, messages})}`)
})

// app.use(express.static('build'));
app.listen(8080, () => console.log('Example app listening on port 8080!'))