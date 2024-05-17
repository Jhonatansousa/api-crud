import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { regexPath } from './utils/regexPath.js'


const database = new Database()

const date = new Date()
const dateType = {weekday: 'long', year: 'numeric',month: 'long', day: 'numeric'}
const hourType = {hour: 'numeric', minute: 'numeric', second: 'numeric'}
const formattedDate = date.toLocaleDateString('pt-br', dateType)
const formattedHour = date.toLocaleTimeString('pt-br', hourType)
const formattedDateTime = `${formattedDate} às ${formattedHour}`

export const routes = [
    {
        method: 'GET', 
        path: regexPath('/task'),
        handler: (req, res) => {
            const { search } = req.query

            const task = database.select('task', search ?  {
                task: search,
                description: search,
                data: search,
            } : null)

            return res.end(JSON.stringify(task)) 
        }
    },
    {
        method: 'POST', 
        path: regexPath('/task'),
        handler: (req, res) => {
            const { title, description, updated_at = null, completed_at = null } = req.body

            const task = {
                id: randomUUID(),
                title,
                description,
                created_at: formattedDateTime,
                updated_at,
                completed_at
                
            } 
            database.insert('task', task)  

            return res.writeHead(201).end()
        }
    },
    {
        method: 'PUT', 
        path: regexPath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if(!title || !description) {    
                return res.writeHead(400, {'Content-Type' : 'application/json'}).end(JSON.stringify({ error: 'Title and Description are Required'}))
            }
            
            database.update('task', id, {
                title,
                description,
                updated_at : formattedDateTime
            })
            
            return res.writeHead(204).end()
        }
        
    },

    {
        method: 'PATCH',
        path: regexPath('/task/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params
            
            database.update('task', id, {
                completed_at: formattedDateTime
            })

            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE', 
        path: regexPath('/task/:id'),
        handler: (req, res) => {
            const { id } = req.params
            database.delete('task', id)

            return res.writeHead(204).end()
        }
    },
    
]