// utils/asyncHandler.js
function handleAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  handleAsync,
};
