"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(err, req, res, next) {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Ocorreu um erro.";
    return res.status(statusCode).json({
        success: false,
        message: message,
    });
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map