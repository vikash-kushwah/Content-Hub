import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import newsletterRouter from "./newsletter";
import feedbackRouter from "./feedback";
import adminRouter, { requireAdmin } from "./admin";
import sitemapRouter from "./sitemap";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sitemapRouter);
router.use(adminRouter);

const protectedPostsRouter = Router();
protectedPostsRouter.post("/posts", requireAdmin, (req, res, next) => postsRouter(req, res, next));
protectedPostsRouter.put("/posts/:slug/update", requireAdmin, (req, res, next) => postsRouter(req, res, next));
protectedPostsRouter.delete("/posts/:slug/delete", requireAdmin, (req, res, next) => postsRouter(req, res, next));
router.use(protectedPostsRouter);

router.use(postsRouter);
router.use(newsletterRouter);
router.use(feedbackRouter);

export default router;
