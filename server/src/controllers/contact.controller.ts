import prisma from "../lib/prisma.js";
import { Request, Response } from "express";

class ContactController {
  async createContact(req: Request, res: Response) {
    try {
      const { name, email, subject, content } = req.body;

      if (!email || !subject || !content) {
        return res.status(400).json({
          success: false,
          message: "All required fields must be provided.",
        });
      }

      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          subject,
          content,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Message sent successfully.",
        data: contact,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async getAllContacts(req: Request, res: Response) {
    try {
      const contacts = await prisma.contact.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        success: true,
        data: contacts,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }

  async deleteContact(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

await prisma.contact.delete({
  where: {
    id,
  },
});

      return res.status(200).json({
        success: true,
        message: "Contact deleted successfully.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}

export default new ContactController();