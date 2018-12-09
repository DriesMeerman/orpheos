const ROLES = {
    READ_ONLY: 0,
    NORMAL: 10,
    MANAGER: 20,
    ADMIN: 30
}

const TABLES = {
    user: "User",
}

const EXIT_CODES = {
    SUCCESS: 0,
    DB_FAILURE: 1,
    UNKNOWN_FAILURE: 5
}


module.exports = Object.freeze({
    roles: ROLES,
    tables: TABLES,
    exit_codes: EXIT_CODES

});