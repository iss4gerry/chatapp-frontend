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
		username: string;
		id: string;
	};
	user: {
		name: string;
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
	name: string;
	username: string;
	email: string;
};
