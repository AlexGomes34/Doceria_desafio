const usuarioDAO = require('../../model/usuario.js')
const MESSAGE_DEFAULT = require('../modulo/messages.js')

const listarUsuarios = async () => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        let result = await usuarioDAO.getSelectAllUsers()
        if (result && result.length > 0) {
            MESSAGE.REQUEST_SUCESS.result = result
            return MESSAGE.REQUEST_SUCESS
        }
        return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Nenhum usuário encontrado" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const atualizarUsuario = async (usuario, id, contentType) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            usuario.id = Number(id)
            const dadosValidos = validarDados(usuario)

            if (dadosValidos) {
                let result = await usuarioDAO.setUpdateUser(usuario)
                if (result) {
                    MESSAGE.SUCESS_UPDATE_ITEM.result = result
                    return MESSAGE.SUCESS_UPDATE_ITEM
                }
                return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Usuário não encontrado" }
            }
            return { status_code: 400, message: "Dados inválidos ou senha muito curta (mínimo 6 caracteres)" }
        }
        return { status_code: 415, message: "Content-Type não suportado" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const inserirUsuario = async (usuario, contentType) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON') {
            const dadosValidos = validarDados(usuario)

            if (dadosValidos) {
                let result = await usuarioDAO.setInsertUser(usuario)
                if (result) {
                    MESSAGE.SUCESS_CREATED_ITEM.result = result
                    return MESSAGE.SUCESS_CREATED_ITEM
                }
            }
            return { status_code: 400, message: "Dados inválidos. Verifique o e-mail e a senha." }
        }
        return { status_code: 415, message: "Content-Type não suportado" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const loginUsuario = async (dadosLogin) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        if (!dadosLogin.email || !dadosLogin.senha) {
            return { status_code: 400, message: "E-mail e senha são obrigatórios" }
        }

        const usuario = await usuarioDAO.setValidacionLogin(dadosLogin.email)
        
        if (usuario && usuario.senha === dadosLogin.senha) {
            MESSAGE.REQUEST_SUCESS.result = usuario
            return MESSAGE.REQUEST_SUCESS
        } else {
            return { status_code: 401, message: "E-mail ou senha inválidos" }
        }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

const deletarUsuario = async (id) => {
    let MESSAGE = JSON.parse(JSON.stringify(MESSAGE_DEFAULT))
    try {
        const idNumero = Number(id)
        if (!isNaN(idNumero) && idNumero > 0) {
            let result = await usuarioDAO.setDeleteUser(idNumero)
            if (result) {
                return MESSAGE.SUCESS_DELETE_ITEM
            }
            return MESSAGE.ERROR_NOT_FOUND || { status_code: 404, message: "Usuário não encontrado" }
        }
        return { status_code: 400, message: "ID inválido" }
    } catch (error) {
        return { status_code: 500, message: "Erro interno no servidor" }
    }
}

function validarDados(usuario) {
    if (
        typeof usuario.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email) ||
        typeof usuario.senha !== "string" || usuario.senha.length < 6
    ) {
        return false
    } else {
        return true
    }
}

module.exports = {
    listarUsuarios,
    inserirUsuario,
    atualizarUsuario,
    deletarUsuario,
    loginUsuario
}