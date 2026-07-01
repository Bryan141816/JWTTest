import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  findUserByEmail,
  findUserById
} from "../repositories/user.repository.js";
import { createRefreshToken, findRefreshTokenyUserId, revokeRefreshToken } from "../repositories/refresh_token.repository.js";
import { textToHash, compareHash } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
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

  const refreshToken = generateRefreshToken(user);

  const refreshHash = await textToHash(refreshToken);

  await createRefreshToken({
    userId: user.id,
    hash: refreshHash,
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
  const verified = verifyRefreshToken(data);
  const refreshTokenHashes = await findRefreshTokenyUserId(verified.id);
  if (refreshTokenHashes.length == 0) {
    throw new Error("Refresh token isn't valid");
  }
  let currentToken = null;
  for (const token of refreshTokenHashes) {
    console.log(data, token.hash, await compareHash(

      data,
      token.hash
    ));
    const matches = await compareHash(

      data,
      token.hash
    );

    if (matches) {
      currentToken = token;
      break;
    }
  }
  if (!currentToken) {
    throw new Error("No matching token");
  }
  const isRevoked = await revokeRefreshToken(currentToken.id);
  const user = await findUserById(verified.id);

  const accessToken = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);
  console.log(refreshToken)
  const refreshHash = await textToHash(refreshToken);
  console.log(refreshHash);
  await createRefreshToken({
    userId: user.id,
    hash: refreshHash,
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