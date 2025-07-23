import { Request, Response } from "express";
import * as commentService from "../services/CommentService";
import { logger } from "../wistonLogger/logger";

// Helper to get Clerk user ID from middleware/session
function getClerkUserId(req: Request): string | undefined {
  // ClerkExpressRequireAuth middleware attaches userId to req.auth.userId
  return (req as any).auth?.userId;
}
// Create a comment
export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const blogId = Number(req.params.blogId);

  // Get userId from Clerk auth
  // ClerkExpressRequireAuth attaches auth info to req.auth
  const userId = getClerkUserId(req);

  if (!content || !userId || !blogId) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const comment = await commentService.createComment(content, userId, blogId);
    res.status(201).json(comment);
  } catch (err : any) {

    // logger.error("Error From User Controller" , `${err.message}`)

     logger.error({
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    status: 500,
    message: err.message

  });
  

  
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// Get all comments for a blog
export const getCommentsForBlog = async (req: Request, res: Response) => {
  const blogId = Number(req.params.blogId);
  try {
    const comments = await commentService.getCommentsForBlog(blogId);
    res.json(comments);
  } catch (err : any) {
    logger.error("Error From getCommentsForBlog Controller" , `${err.message}`)
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
