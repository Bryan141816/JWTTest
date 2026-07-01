import crypto from "crypto";
export async function hashRefreshToken(newRefreshToken) {
  const newHash =
    crypto.createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
  return newHash;
}
export async function generateRefreshToken() {
  const newRefreshToken =
    crypto.randomBytes(64).toString("hex");
  return newRefreshToken;
}