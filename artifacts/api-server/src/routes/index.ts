import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import newsletterRouter from "./newsletter";
import feedbackRouter from "./feedback";

const router: IRouter = Router();

router.use(healthRouter);
router.use(postsRouter);
router.use(newsletterRouter);
router.use(feedbackRouter);

export default router;
