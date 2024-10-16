import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
	client = new Client();
	account;

	constructor() {
		this.client
			.setEndpoint(config.appwriteUrl)
			.setProject(config.appwriteProjectId);
		this.account = new Account(this.client);
	}

	async createAccount({ email, password, name }) {
		try {
			const userAccount = await this.account.create(
				ID.unique(),
				email,
				password,
				name
			);
			if (userAccount) {
				return await this.login({ email, password });
			}
			return userAccount;
		} catch (error) {
			console.error("Error creating account:", error.message);
			throw error;
		}
	}

	async login({ email, password }) {
		try {
			const session = await this.account.createEmailSession(
				email,
				password
			);
			console.log("Login successful:", session);
			return await this.getCurrentUser();
		} catch (error) {
			console.error("Error logging in:", error.message);
			throw error;
		}
	}

	async isLoggedIn() {
		try {
			await this.account.get();
			return true;
		} catch (error) {
			return false;
		}
	}

	async getCurrentUser() {
		if (await this.isLoggedIn()) {
			try {
				return await this.account.get();
			} catch (error) {
				console.log("Error getting current user:", error.message);
				throw error;
			}
		} else {
			console.log("User is not logged in");
			return null;
		}
	}

	async logout() {
		try {
			return await this.account.deleteSessions();
		} catch (error) {
			console.error("Error logging out:", error.message);
			throw error;
		}
	}
}

const authService = new AuthService();
export default authService;
