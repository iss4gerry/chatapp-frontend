export type Response<T> = {
	status: number;
	message: string;
	data: T;
};

export type FriendList = {
	id: string;
	userId: string;
	friendId: string;
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
	friend: {
		name: string;
		username: string;
		id: string;
	};
};
