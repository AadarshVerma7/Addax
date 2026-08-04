import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import prisma from "../lib/prisma.js";
import { generateToken } from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


class AuthController {
  // Register
  public register = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { name, email, password, image } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "All fields are required.",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "User already exists.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          image,
          provider: "LOCAL",
        },
      });

      const token = generateToken(user.id);

      return res.status(201).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          provider: user.provider,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  };

  // Login
  public login = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid credentials.",
        });
      }

      if (user.provider === "GOOGLE" && !user.passwordHash) {
        return res.status(400).json({
          message: "Please continue with Google.",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash!
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid credentials.",
        });
      }

      const token = generateToken(user.id);

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          provider: user.provider,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  };

  // Google Login
  public googleLogin = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { credential } = req.body;

      if (!credential) {
        return res.status(400).json({
          message: "Google credential is required.",
        });
      }

      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return res.status(401).json({
          message: "Invalid Google token.",
        });
      }

      const email = payload.email;

      if (!email) {
        return res.status(400).json({
          message: "Google account has no email.",
        });
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: payload.name ?? "",
            email,
            image: payload.picture,
            provider: "GOOGLE",
            googleId: payload.sub,
          },
        });
      } else if (user.provider === "LOCAL") {
        // Link an existing local account to Google
        user = await prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            provider: "GOOGLE",
            googleId: payload.sub,
            image: payload.picture ?? user.image,
          },
        });
      }

      const token = generateToken(user.id);

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          provider: user.provider,
        },
      });
    } catch (error) {
      console.error(error);

      return res.status(401).json({
        message: "Google authentication failed.",
      });
    }
  };

  // Current User
  public getMe = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          provider: true,
          createdAt: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Internal server error.",
      });
    }
  };

  // Logout
  public logout = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    return res.json({
      message: "Logged out successfully.",
    });
  };
}

export default new AuthController();