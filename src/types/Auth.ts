export type Response<T> = {
	status: number;
	message: string;
	data: T;
};

export type LoginResponse = {
	id: string;
	name: string;
	username: string;
	email: string;
	password: string;
	avatar: number;
	createdAt: string;
	updatedAt: string;
	isEmailVerified: boolean;
};
