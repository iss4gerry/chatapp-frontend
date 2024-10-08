<script setup lang="ts">
import { ref, watch, nextTick, toRef } from 'vue';
import ChatInput from './ChatInput.vue';
import axios from '../api/index';
import { Response } from '../types/Friend';
import { Message, NewMessagePayload, RoomResponse } from '../types/Message';

const chats = ref<{ senderId: string; message: string; dateTime: string }[]>(
	[]
);
const friendStatus = ref<boolean>(false);
const scrollTarget = ref<HTMLElement | null>(null);
const userId = localStorage.getItem('userId')?.trimEnd();
const props = defineProps<{
	friendId: string | undefined;
	oldMessage: Message[] | undefined;
}>();

const friendIdRef = toRef(props, 'friendId');
const oldMessageRef = toRef(props, 'oldMessage');

import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000', {
	query: { userId },
});

const sendMessage = async (message: string) => {
	try {
		const roomId = `${[userId, props.friendId].sort().join('')}`;

		chats.value.push({
			senderId: userId!,
			message: message,
			dateTime: formatDateTime(new Date()),
		});
		await nextTick();
		if (scrollTarget.value) {
			scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
		}
		console.log(roomId);
		const { data } = await axios.get<Response<RoomResponse>>(
			`http://localhost:3000/message/room/${roomId}`
		);

		if (data.data === null) {
			await axios.post<Response<RoomResponse>>(
				'http://localhost:3000/message/room/add',
				{
					roomId: roomId,
					user1Id: userId,
					user2Id: props.friendId,
				}
			);
		}

		socket.emit('joinRoom', roomId);

		sendContent({
			roomId,
			senderId: userId!,
			content: message,
		});
	} catch (error) {}
};

function sendContent(payload: NewMessagePayload) {
	socket.emit('sendMessage', payload);
}

socket.on(
	'userStatusUpdate',
	(users: {
		[key: string]: { online: boolean; lastOnline: string | null };
	}) => {
		for (const userId in users) {
			const user = users[userId];
			if (!user.online) {
				if (userId === props.friendId) {
					friendStatus.value = false;
				}
			} else {
				friendStatus.value = true;
			}
		}
	}
);

socket.on('newMessage', async (message: Message) => {
	if (message.senderId === props.friendId) {
		chats.value.push({
			senderId: message.senderId,
			message: message.content,
			dateTime: formatDateTime(new Date()),
		});
		await nextTick();
		if (scrollTarget.value) {
			scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
		}
	}
});

function formatDateTime(date: Date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

watch(chats.value, async () => {
	await nextTick();
	if (scrollTarget.value) {
		scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
	}
});

watch(friendIdRef, () => {
	chats.value = [];
});

watch(oldMessageRef, async () => {
	await nextTick();
	if (scrollTarget.value) {
		scrollTarget.value.scrollIntoView({ behavior: 'smooth' });
	}
});
</script>

<template>
	<div class="flex flex-col">
		<div
			class="chat-header flex justify-between items-center px-8 min-h-[8vh] max-h-[8vh] bg-[#36393e]"
		>
			<div class="user-details flex items-center gap-4">
				<div class="avatar">
					<img
						src="https://api.multiavatar.com/Starcrasher.svg"
						alt="aa"
						class="max-h-[6vh] mr-5"
					/>
				</div>
				<div class="username flex flex-col">
					<h3 class="text-white text-xl font-bold">TEsSS</h3>
					<h4 class="text-sm text-gray-300">
						{{ friendStatus === true ? 'Online' : 'Offline' }}
					</h4>
				</div>
			</div>
		</div>
		<div
			class="chat-messages flex flex-col gap-4 p-4 overflow-auto bg-[#424549] max-h-[71vh] min-h-[71vh] overflow-y-scroll"
		>
			<div v-for="(chat, index) in oldMessage" :key="index">
				<div
					:class="[
						'chat',
						chat.senderId === userId ? 'chat-end' : 'chat-start',
					]"
				>
					<div class="chat-bubble bg-[#36393e] text-white">
						{{ chat.content }}
					</div>
				</div>
			</div>
			<div v-for="(chat, index) in chats" :key="index">
				<div
					:class="[
						'chat',
						chat.senderId === userId ? 'chat-end' : 'chat-start',
					]"
				>
					<div class="chat-bubble bg-[#36393e] text-white">
						{{ chat.message }}
					</div>
				</div>
			</div>
			<div ref="scrollTarget"></div>
		</div>
		<ChatInput v-on:message="sendMessage" />
	</div>
</template>
