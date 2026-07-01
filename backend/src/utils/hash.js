import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export async function textToHash(text) {
  return bcrypt.hash(text, SALT_ROUNDS);
}

export async function compareHash(text, hash) {
  return bcrypt.compare(text, hash);
}
