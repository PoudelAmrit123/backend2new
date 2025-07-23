import { Router } from 'express';

import blogRoutes from './blogRoutes';
import commentRoutes from './commentRoutes';

const router = Router();

router.use('/api/blogs', blogRoutes);
router.use('/api/comments', commentRoutes);

export default router;
