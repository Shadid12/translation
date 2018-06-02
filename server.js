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
    res.send(
`
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>React Intl Translations Example</title>
    </head>
    <body>
        <div id="container"></div>
        <script>
            window.App = ${serialize({locale, messages})};
        </script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/16.4.0/umd/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/16.4.0/umd/react-dom.production.min.js"></script>
    </body>
    </html>
`
    )
})

// app.use(express.static('build'));
app.listen(8080, () => console.log('Example app listening on port 8080!'))