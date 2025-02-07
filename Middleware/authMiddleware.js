import JWT from "jsonwebtoken";

export const requireSignIn = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send({ success: false, message: "Unauthorized: Token missing or incorrect format" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token and extract user data
    const decoded = JWT.verify(token, process.env.SECRET);
    req.user = decoded; // Attach user info (like _id) to req.user

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error); // Log error for debugging
    return res.status(401).send({ success: false, message: "Invalid or expired token" });
  }
};
