class HttpResponse {
    constructor(success, statusCode, message, data) {
        this.success = success;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

class Http {

    static SUCCESS = 200;
    static CREATED = 201;
    static BAD_REQUEST = 400;
    static UNAUTHORIZED = 401;
    static FORBIDDEN_ACCESS = 403;
    static INTERNAL_SERVER_ERROR = 500;
    static SUCCESS_TRUE = true;
    static SUCCESS_FALSE = false;

    static sendResponse(res, statusCode, success, message = '', data = {}) {
        const response = new HttpResponse(success, statusCode, message, data);
        return res.status(statusCode).json(response);
    }
}

module.exports = { HttpResponse, Http };