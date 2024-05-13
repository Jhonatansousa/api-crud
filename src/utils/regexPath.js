export function regexPath(path) {

    // criamos uma variável que é tudo que for de a~z e A~Z que tenha 1 caracter ou mais
        const routeParametersRegex = /:([a-zA-Z]+)/g
        // e nós trocamos esse parametro pelo regex que tem todas os caracteres do Unique Universal ID (UUID)
        const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
    //  ?<$1> => ele vai nomear as variáveis da url, qualquer uma que eu escreva no arquivo routes, automaticamente 
    
        const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
    
        return pathRegex
    }