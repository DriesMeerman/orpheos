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
    user: "user",
    category: "category",
    project: "project",
    post: "post",
    picture: "picture",
    post_picture: "post_picture",
    project_member: "project_member",
    comment: "comment",
    post_comment: "post_comment"
}

const EXIT_CODES = {
    SUCCESS: 0,
    DB_FAILURE: 1,
    UNKNOWN_FAILURE: 5
}

const VIEW_TYPES = {
    user: {
        NEW: { title: "New User", state: "NEW", postUrl: "/admin/users/new" },
        UPDATE: { title: "Update User", state: "UPDATE", postUrl: "" }
    },
    category: {
        NEW: { title: "New Category", state: "NEW", postUrl: "/admin/categories/new" },
        UPDATE: { title: "Update Category", state: "UPDATE", postUrl: "" }
    }
}


module.exports = Object.freeze({
    roles: ROLES,
    roles_lookup: ROLES_LOOKUP,
    tables: TABLES,
    exit_codes: EXIT_CODES,
    view_types: VIEW_TYPES
});