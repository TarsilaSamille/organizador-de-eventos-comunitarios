const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  if (!req) {
    return res.status(400).send("Request object is undefined");
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  if (!req.session.userId) {
    console.log(req.session);
    return res
      .status(401)
      .send({ message: "You must be logged in to view this page" });
  }

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}
module.exports = authenticateToken;
