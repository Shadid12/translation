import express from 'express';
import {sync as globSync} from 'glob';
import {readFileSync} from 'fs';
import * as path from 'path';

const app = express()


const translations = globSync('./build/lang/*.json')
    .map((filename) => {
        path.basename(filename, '.json')
    })

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(8080, () => console.log('Example app listening on port 8080!'))