module.exports = class ApiError extends Error {
    status;
    errors;
    message;

    constructor(status, message, errors = []) {
        super();
        this.status = status;
        this.errors = errors;
        this.message = message;
    }

    static UnauthorizedError() {
        return new ApiError(401, "Пользователь не авторизован");
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}