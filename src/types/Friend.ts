export type Response<T> = {
	status: number;
	message: string;
	data?: T;
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
		avatar: number;
		username: string;
		id: string;
	};
	user: {
		name: string;
		avatar: number;
		username: string;
	};
};

export type AddFriend = {
	id: string;
	userId: string;
	friendId: string;
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type SearchFriend = {
	id: string;
	avatar: number;
	name: string;
	username: string;
	email: string;
};
