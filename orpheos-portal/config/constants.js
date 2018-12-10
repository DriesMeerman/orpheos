const ROLES = {
    READ_ONLY: { name: "Read Only", value: 0 },
    NORMAL: { name: "Normal", value: 10 },
    MODERATOR: { name: "Moderator", value: 20 },
    ADMIN: { name: "Admin", value: 100 },
    GOD: { name: "GOD", value: 1000 }
}

const ROLES_LOOKUP = Object.keys(ROLES).reduce((total, current) => {
    let role = ROLES[current];
    role.key = current;
    total[role.value] = role;
    return total;
}, {});

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
    roles_lookup: ROLES_LOOKUP,
    tables: TABLES,
    exit_codes: EXIT_CODES

});