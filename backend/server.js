const express = require('express');
const cors = require('cors');
const dbConnect = require('./lib/dbConnect');
const blogsRouter = require('./routes/blogs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/blogs', async (req, res, next) => {
  try {
    await dbConnect();
    next();
  } catch (err) {
    next(err);
  }
}, blogsRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));
