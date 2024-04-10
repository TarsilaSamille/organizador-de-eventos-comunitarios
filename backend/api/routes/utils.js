const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  if (!req) {
    return res.status(400).send("Request object is undefined");
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, `${process.env.SESSION_SECRET}`, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    req.session.userId = user.userId;
    next();
  });
}
module.exports = authenticateToken;
