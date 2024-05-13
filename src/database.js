// importo o fileSystem do node, promises é mais facil de usar e atual
import fs from 'node:fs/promises'

// defino o caminho onde o banco de dados será criado, como um arquivo físico
const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    // atributo private => significa que só poderá ser acessado dentro dessa classe
    #database = {}
// constructor => toda vez que a classe for instanciada ele irá executar essa função automaticamente
    constructor() {
        // ao iniciar ele vai ler o arquivo que está no caminho do 'databasePath'
        fs.readFile(databasePath, 'utf8')
        // tentativa
        .then(data => {
            // colocar no atributo os dados em formato JSON
            this.#database = JSON.parse(data)
        })
        // caso dê erro ele vai escrever no arquivo físico
        .catch(() => {
            this.#persist()
        })
    }
    // aqui é para escrever no arquivo físico
    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    // #########select
    select(table, search) {
        let data = this.#database[table] ?? []

        if(search) {
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].toLowerCase().include(value.toLowerCase())
                })
            })
        }
        return data
    }


    // ############INSERT
    insert(table, data) {
        if(Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }
        this.#persist
        return data
    }

    update(table, id, data) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            this.#database[table][rowIndex] = {id, ...data}
            this.#persist()
        }
    }

    delete(table, id) {
        const rowIndex = this.#database[table].findIndex(row => row.id === id)

        if(rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist
        }
    }
}