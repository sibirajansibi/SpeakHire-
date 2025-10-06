const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

exports.isCandidate = (req, res, next) => {
  if (req.userRole === "candidate") {
    next();
  } else {
    res.status(403).json({ message: "Require Candidate Role!" });
  }
};

exports.isRecruiter = (req, res, next) => {
  if (req.userRole === "recruiter") {
    next();
  } else {
    res.status(403).json({ message: "Require Recruiter Role!" });
  }
};

