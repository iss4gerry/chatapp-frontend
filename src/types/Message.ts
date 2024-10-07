export type RoomResponse = {
	id: string;
	user1Id: string;
	user2Id: string;
	createdAt: Date;
};

export interface NewMessagePayload {
	roomId: string;
	senderId: string;
	content: string;
}

export interface Message {
	id: string;
	roomId: string;
	senderId: string;
	content: string;
	createdAt: Date;
}
