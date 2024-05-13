// importo o módulo de http do node nativo
import http from 'node:http'
import { jsonConverter } from './middlewares/jsonConverter.js'
import { routes } from './routes.js'
import { extractQueryParams } from './utils/extract-query.js'


// crio o servidor
const server = http.createServer( async (req, res) => {
    // faço uma desestruturação para pegar as propriedades methode e url da requisição (req)
    const { method, url } = req
    
    // função interceptadora
    await jsonConverter(req, res)


    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })

    if (route) {
        const routeParams = req.url.match(route.path)

        const {query, ...params} = routeParams.groups
        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
    }
    return res.writeHead(404).end

})

server.listen(3333)