module.exports = class UserDto {
    id;
    email;
    password;
    userName;
    userLastName;
    userPhoto;
    userSetting;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.password = model.password;
        this.userName = model.userName;
        this.userLastName = model.userLastName;
        this.userPhoto = model.userPhoto;
        this.userSetting = model.userSetting;
    }
}