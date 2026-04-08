import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import newsletterRouter from "./newsletter";
import feedbackRouter from "./feedback";
import adminRouter, { requireAdmin } from "./admin";
import sitemapRouter from "./sitemap";
import rssRouter from "./rss";

const router: IRouter = Router();

router.use(healthRouter);
router.use(sitemapRouter);
router.use(rssRouter);
router.use(adminRouter);

const protectedPostsRouter = Router();
protectedPostsRouter.post("/posts", requireAdmin, (req, res, next) => postsRouter(req, res, next));
protectedPostsRouter.put("/posts/:slug/update", requireAdmin, (req, res, next) => postsRouter(req, res, next));
protectedPostsRouter.delete("/posts/:slug/delete", requireAdmin, (req, res, next) => postsRouter(req, res, next));
router.use(protectedPostsRouter);

router.use(postsRouter);
const protectedNewsletterRouter = Router();
protectedNewsletterRouter.get("/newsletter/subscribers", requireAdmin, (req, res, next) => newsletterRouter(req, res, next));
protectedNewsletterRouter.delete("/newsletter/subscribers/:id", requireAdmin, (req, res, next) => newsletterRouter(req, res, next));
router.use(protectedNewsletterRouter);

router.use(newsletterRouter);
router.use(feedbackRouter);

export default router;
