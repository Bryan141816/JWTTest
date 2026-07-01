import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById
} from "../repositories/user.repository.js";
import { createRefreshToken, findRefreshTokenByHash, revokeRefreshToken } from "../repositories/refresh_token.repository.js";
import { textToHash, compareHash } from "../utils/hash.js";
import { generateAccessToken } from "../utils/jwt.js";
import { generateRefreshToken, hashRefreshToken } from "../utils/refresh_token.js";
export async function signup(data) {
  const existing = await findUserByEmail(data.email);

  if (existing) {
    throw new Error("Email already exists.");
  }

  const passwordHash = await textToHash(data.password);

  const userId = await createUser({
    email: data.email,
    username: data.username,
    passwordHash,
  });

  return {
    id: userId,
    email: data.email,
    username: data.username,
  };
}


export async function login(data) {
  const user = await findUserByEmail(data.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const validPassword = await compareHash(
    data.password,
    user.password_hash
  );

  if (!validPassword) {
    throw new Error("Invalid email or password");
  }


  const accessToken = generateAccessToken(user);

  const refreshToken = await generateRefreshToken();
  const refreshHash = await hashRefreshToken(refreshToken);
  await createRefreshToken({
    userId: user.id,
    hash: refreshHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
  });

  return {
    user: {
      id: user.id,
      username: user.user_name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  };
}

export async function refresh(data) {

  const hashedToken = await hashRefreshToken(data);
  const currentToken = await findRefreshTokenByHash(hashedToken);
  if (!currentToken) {
    throw new Error("No matching token");
  }
  const isRevoked = await revokeRefreshToken(currentToken.id);
  const user = await findUserById(currentToken.user_id);

  const accessToken = await generateAccessToken(user);

  const refreshToken = await generateRefreshToken();
  const refreshHash = await hashRefreshToken(refreshToken);
  await createRefreshToken({
    userId: user.id,
    hash: refreshHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
  });

  return {
    user: {
      id: user.id,
      username: user.user_name,
      email: user.email,
    },
    accessToken,
    refreshToken: refreshToken,
  };
}