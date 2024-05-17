import { parse } from 'csv-parse';
import fs from 'node:fs';


const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParse = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2 //skipa a primeira linha
})

async function run() {
    const linesParse = stream.pipe(csvParse)

    for await (const line of linesParse) {
        const [title, description] = line

        await fetch('http://localhost:3333/task', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                title, 
                description,
            })
        })

        wait(1000)
    }
}

run()

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}