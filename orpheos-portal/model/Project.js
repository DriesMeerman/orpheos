class Project {
    constructor (project) {
        this.id          = project.id;
        this.name        = project.name;
        this.description = project.description;
        this.category    = project.category;
        this.owner       = project.owner;
        this.updated     = project.updated;
        this.created     = project.created;
    }
}

module.exports = Project;