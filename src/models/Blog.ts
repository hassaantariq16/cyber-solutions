import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  author: string;
  slug: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },

    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    published: {
      type: Boolean,
      default: false,
    },

  },
  {
    timestamps: true,
  }
);

// Create index for better query performance
BlogSchema.index({ slug: 1 });
BlogSchema.index({ published: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });

// Generate slug from title before saving
BlogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.isModified('slug')) {
    this.slug = (this.title as string)
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
  next();
});

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
