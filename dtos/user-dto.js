module.exports = class UserDto {
    id;
    email;
    userName;
    userLastName;
    userPhoto;
    userSetting;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.userName = model.userName;
        this.userLastName = model.userLastName;
        this.userPhoto = model.userPhoto;
        this.userSetting = model.userSetting;
    }
}