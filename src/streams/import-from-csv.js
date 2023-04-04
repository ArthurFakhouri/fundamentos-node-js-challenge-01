import { parse } from 'csv-parse';
import fs from 'node:fs'

const taskCsvPath = new URL("tasks.csv", import.meta.url);

export const importCsvFileToDatabase = async () => {
    const parser = fs
        .createReadStream(taskCsvPath)
        .pipe(parse({
            delimiter: ';',
            skipEmptyLines: true,
            fromLine: 2,
        }));
    for await (const record of parser) {
        await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            body: JSON.stringify({
                title: record[0],
                description: record[1]
            })
        })
    }
};