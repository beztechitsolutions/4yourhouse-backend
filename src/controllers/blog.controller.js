import axios from 'axios';
import Posts from '../models/post.model.js';
import { slugGenerator } from '../common/utils/slugGenerator.js';
import { checkMongoID } from '../common/utils/checkMongoID.js';
import { handleValidation } from '../common/utils/handleValidation.js';
import { uploadFileOnCloud, deleteFileFromCloud } from '../common/utils/uploadFile.js';


// ========== Add new Post ==========
export const addPost = async (request, response) => {
	try {
		const { files, body } = request;

		// if (files?.thumbnail && files.thumbnail[0]) {
		// 	const uploadedImg = await uploadFileOnCloud(files.thumbnail[0].path, files.thumbnail[0].filename);
		// 	const { data } = await axios.get(`http://localhost:5000/v1/source/${uploadedImg?.id}`);
		// 	body['thumbnailID'] = `${uploadedImg?.id}`;
		// 	body['thumbnail'] = `${data.url}`;
		// }

		const post = await Posts.create({ ...body, slug: await slugGenerator(body?.title, Posts), thumbnail: files.thumbnail[0].filename });
		response.status(201).json({ status: 201, post });
	} catch (error) {
		console.log(error);

		if (error.name === 'ValidationError' || error.name === 'MongoServerError') {
			response.status(422).json({ status: 422, message: handleValidation(error, "Posts") });
		} else {
			console.log(error);
			response.status(500).json({ status: 500, message: "Internal Server Error" });
		}
	}
};


// ========== Get all Posts ==========
export const getPosts = async (request, response) => {
	try {
		const posts = await Posts.find();
		response.status(200).json({ status: 200, posts });
	} catch (error) {
		console.error("Posts Fetching Error:", error);
		response.status(500).json({ status: 500, message: "Internal server error" });
	}
};


// ========== Get Single Post ==========
export const getSinglePost = async (request, response) => {
	try {
		const { id } = request.params;

		if (!checkMongoID(id)) return response.status(400).json({ status: 400, message: "Invalid MongoDB ObjectID" });

		const post = await Posts.findById(id).select("-__v").lean();
		if (!post) return response.status(404).json({ status: 404, message: "Post not found" });

		response.status(200).json({ status: 200, post });
	} catch (error) {
		console.error("Single Post Fetching Error:", error);
		response.status(500).json({ status: 500, message: "Internal server error" });
	}
};


// ========== Update Post ==========
export const updatePost = async (request, response) => {
	try {
		const { id } = request.params;
		const { files, body } = request;

		if (!checkMongoID(id)) return response.status(400).json({ status: 400, message: "Invalid MongoDB ObjectID" });

		const existingPost = await Posts.findById(id);

		// if (files?.thumbnail && files.thumbnail[0]) {
		// 	if (existingPost?.thumbnailID) {
		// 		const thumbnailID = existingPost.thumbnailID.split('/').pop();
		// 		await deleteFileFromCloud(thumbnailID);
		// 	}

		// 	const uploadedImg = await uploadFileOnCloud(files.thumbnail[0].path, files.thumbnail[0].filename);
		// 	const { data } = await axios.get(`http://localhost:5000/v1/source/${uploadedImg?.id}`);
		// 	body['thumbnailID'] = `${uploadedImg?.id}`;
		// 	body['thumbnail'] = `${data.url}`;
		// }

		const post = await Posts.findByIdAndUpdate(id, body, { new: true });

		response.status(200).json({ status: 200, post });
	} catch (error) {
		console.error("Post Updating Error:", error);
		response.status(500).json({ status: 500, message: "Internal server error" });
	}
};


// ========== Delete Post ==========
export const deletePost = async (request, response) => {
	try {
		const { id } = request.params;

		if (!checkMongoID(id)) return response.status(400).json({ status: 400, message: "Invalid MongoDB ObjectID" });

		await Posts.findByIdAndDelete(id);
		response.status(200).json({ status: 200, message: "Post deleted successfully" });
	} catch (error) {
		console.error("Post Deleting Error:", error);
		response.status(500).json({ status: 500, message: "Internal server error" });
	}
};