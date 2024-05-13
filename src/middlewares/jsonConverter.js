// crio a função que vai interceptar a requisição que é em streams por buffer, pegar cada parte e armazenar em um array
export async function jsonConverter(req, res) {
    // array que será armazenado todas as partes (chunks)
    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        // pego o corpo da requisição e o transformo em uma string JSON
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        // caso não tenha nada será nulo
        req.body=null
    }

    // a resposta será como o tipo de conteúdo: em formato JSON
    res.setHeader("Content-type", "application/json")
}