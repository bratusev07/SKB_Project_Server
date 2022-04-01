module.exports = class AuthDto {
    id;
    email;
    password;
    userId;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.password = model.password;
        this.userId = model.userId;
    }
}