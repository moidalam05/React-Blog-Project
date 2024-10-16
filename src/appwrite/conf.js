import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
	client = new Client();
	databases;
	bucket;

	constructor() {
		this.client
			.setEndpoint(config.appwriteUrl)
			.setProject(config.appwriteProjectId);
		this.databases = new Databases(this.client);
		this.bucket = new Storage(this.client);
	}

	async createPost({ title, slug, content, featuredImage, status, userId }) {
		try {
			return await this.databases.createDocument(
				config.appwriteDatabaseId,
				config.appwriteCollectionId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
					userId,
				}
			);
		} catch (error) {
			console.error("Error creating post:", error.message);
			throw error;
		}
	}

	async updatePost(slug, { title, content, featuredImage, status }) {
		try {
			return await this.databases.updateDocument(
				config.appwriteDatabaseId,
				config.appwriteCollectionId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
				}
			);
		} catch (error) {
			console.error("Error updating post:", error.message);
			throw error;
		}
	}

	async deletePost(slug) {
		try {
			await this.databases.deleteDocument(
				config.appwriteDatabaseId,
				config.appwriteCollectionId,
				slug
			);
			return true;
		} catch (error) {
			console.error("Error deleting post:", error.message);
			throw error;
		}
	}

	async getPost(slug) {
		try {
			return await this.databases.getDocument(
				config.appwriteDatabaseId,
				config.appwriteCollectionId,
				slug
			);
		} catch (error) {
			console.error("Error getting post:", error.message);
			throw error;
		}
	}

	async getPosts(queries = [Query.equal("status", "active")]) {
		try {
			return await this.databases.listDocuments(
				config.appwriteDatabaseId,
				config.appwriteCollectionId,
				queries
			);
		} catch (error) {
			console.error("Error getting posts:", error.message);
			throw error;
		}
	}

	// file uploade service
	async uploadFile(file) {
		try {
			return await this.bucket.createFile(
				config.appwriteBucketId,
				ID.unique(),
				file
			);
		} catch (error) {
			console.error("Error uploading file:", error.message);
			throw error;
		}
	}

	async deleteFile(fileId) {
		try {
			await this.bucket.deleteFile(config.appwriteBucketId, fileId);
			return true;
		} catch (error) {
			console.error("Error deleting file:", error.message);
			throw error;
		}
	}

	getFilePreviewUrl(fileId) {
		try {
			return this.bucket.getFilePreview(config.appwriteBucketId, fileId);
		} catch (error) {
			console.error("Error getting file preview URL:", error.message);
			throw error;
		}
	}
}

const service = new Service();
export default service;
