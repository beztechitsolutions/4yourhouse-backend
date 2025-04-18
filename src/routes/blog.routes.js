import { Router } from 'express';
import { addPost, getPosts, getSinglePost, updatePost, deletePost } from '../controllers/blog.controller.js';
import { uploadFile } from '../common/middlewares/uploadFile.js';
import { authGuard } from '../common/guards/auth.guard.js';
import { roleGuard } from '../common/guards/role.guard.js';

const router = Router();

const fields = [{ name: "thumbnail", maxCount: 1 }];

router.post('/posts', uploadFile(fields), addPost);
router.get('/posts', getPosts);
router.get('/posts/:id', getSinglePost);
router.patch('/posts/:id', uploadFile(fields), updatePost);
router.delete('/posts/:id', deletePost);

export default router;