// higher-order function (takes one or more function as arguments, or returns a function as its result) to catch our asynchronous errors
module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);
