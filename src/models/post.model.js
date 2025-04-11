import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"]
        },
        slug: {
            type: String,
            required: [true, "Title is required"],
            unique: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
        },
        shortDescription: {
            type: String,
            required: [true, "Short Description is required"],
        },
        thumbnail: {
            type: String,
            required: [true, "Thumbnail Image is required"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
    },
    { timestamps: true }
);

const postModel = models.Posts || model("Posts", postSchema);
export default postModel;