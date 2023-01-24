function getFullUrl(req, suffix) {
    return `${req.protocol}://${req.get('host')}${suffix}`;
  }
  
  module.exports = { getFullUrl };