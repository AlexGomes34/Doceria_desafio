const database = require("../database.js")

const getSelectAllUsers = async function () {
    try {
        const result = await database('tbl_usuario').orderBy('id_usuario')
        return result.length > 0 ? result : false
    } catch (error) {
        return false
    }
}

const setInsertUser = async function (usuario) {
    try {
        const result = await database('tbl_usuario').insert({
            email: usuario.email,
            senha: usuario.senha
        })
        return result ? result : false
    } catch (error) {
        return false
    }
}

const setValidacionLogin = async function (email) {
    try {
        let result = await database('tbl_usuario')
            .where('email', email)
            .first();
        return result ? result : false
    } catch (error) {
        return false;
    }
}

const setUpdateUser = async function (usuario) {
    try {
        const result = await database('tbl_usuario').where('id_usuario', usuario.id).update({
            email: usuario.email,
            senha: usuario.senha
        })
        return result > 0 ? result : false
    } catch (error) {
        return false
    }
}

const setDeleteUser = async function (id) {
    try {
        const result = await database('tbl_usuario').where('id_usuario', id).del()
        return result > 0 ? result : false
    } catch (error) {
        return false
    }
}

module.exports = {
    getSelectAllUsers,
    setInsertUser,
    setUpdateUser,
    setDeleteUser,
    setValidacionLogin
}