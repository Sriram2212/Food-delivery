const morgan = require('morgan');

const requestLoggerMiddleware = morgan((tokens, req, res) => {
    return [
        '📝',
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        '-',
        tokens['response-time'](req, res),
        'ms',
    ].join(' ');
});

module.exports = requestLoggerMiddleware;
