const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { z } = require('zod');

const BlogSchema = z.object({
  title: z.string().min(1).max(200).trim(),
  content: z.string().min(1),
  author: z.string().min(1).trim(),
  slug: z.string().regex(/^[a-z0-9-]+$/).optional(),
  published: z.boolean().optional(),
});

// GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const published = req.query.published;
    const search = req.query.search;

    const query = {};
    if (published !== undefined) query.published = published === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({ success: true, data: { blogs, pagination: { page, limit, total, totalPages } } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch blogs' });
  }
});

// POST /api/blogs
router.post('/', async (req, res) => {
  try {
    const parsed = BlogSchema.parse(req.body);

    if (!parsed.slug) {
      parsed.slug = parsed.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }

    const existing = await Blog.findOne({ slug: parsed.slug });
    if (existing) parsed.slug = `${parsed.slug}-${Date.now()}`;

    const blog = new Blog(parsed);
    await blog.save();
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Validation or save error' });
  }
});

// GET /api/blogs/:slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch blog' });
  }
});

// PUT /api/blogs/:slug
router.put('/:slug', async (req, res) => {
  try {
    const parsed = BlogSchema.partial().parse(req.body);
    let newSlug = req.params.slug;
    if (parsed.title) {
      newSlug = parsed.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    const updated = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { ...parsed, slug: newSlug, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: 'Validation or update error' });
  }
});

// DELETE /api/blogs/:slug
router.delete('/:slug', async (req, res) => {
  try {
    const deleted = await Blog.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) return res.status(404).json({ success: false, error: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
});

module.exports = router;
