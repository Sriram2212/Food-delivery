const successResponse = (data, message = 'Success', statusCode = 200) => {
    return {
        success: true,
        message,
        data,
        statusCode,
    };
};

const errorResponse = (message = 'Error occurred', statusCode = 500, errors = null) => {
    return {
        success: false,
        message,
        statusCode,
        errors,
    };
};

module.exports = {
    successResponse,
    errorResponse,
};
