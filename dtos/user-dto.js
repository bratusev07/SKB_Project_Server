module.exports = class UserDto {
    id;
    userName;
    userLastName;
    userPhoto;
    userSetting;
    visits;

    constructor(model) {
        this.id = model._id;
        this.userName = model.userName;
        this.userLastName = model.userLastName;
        this.userPhoto = model.userPhoto;
        this.userSetting = model.userSetting;
        this.visits = model.visits;
    }
}