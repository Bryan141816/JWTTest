import { signup as signupService, login as LoginService, refresh as RefreshService } from "../services/auth.service.js";

export async function signup(req, res) {
  try {
    const {
      email,
      password,
      username,
    } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const user = await signupService({
      email,
      password,
      username,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields.",
      });
    }

    const result = await LoginService({
      email,
      password,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken: result.accessToken,
      user: result.user,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export async function refresh(req, res) {
  try {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Missing refresh token",
      });
    }

    const result = await RefreshService(refreshToken);

    console.log(result.refreshToken);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      accessToken: result.accessToken,
      user: result.user,
    });

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
}