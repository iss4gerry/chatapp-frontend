<script setup lang="ts">
import { ref, watch, nextTick, toRef, defineEmits } from 'vue';
import ChatInput from './ChatInput.vue';
import axios from '../api/index';
import { Response } from '../types/Friend';
import { Message, NewMessagePayload, RoomResponse } from '../types/Message';
import * as CryptoJS from 'crypto-js';

const BASE_URL = import.meta.env.VITE_BE_URL;
const WS_URL = BASE_URL.replace(/^https?:\/\//, '');

const chats = ref<{ senderId: string; message: string; dateTime: string }[]>(
	[]
);

const friendStatus = ref<boolean>();
const scrollTarget = ref<HTMLElement | null>(null);
const emit = defineEmits(['updateFriend']);
const encryptedUserId: string = localStorage.getItem('userId')!;
const userId: string = CryptoJS.AES.decrypt(
	encryptedUserId,
	import.meta.env.VITE_SECRET_KEY
)
	.toString(CryptoJS.enc.Utf8)
	.trimEnd();

const props = defineProps<{
	friendId: string | undefined;
	friendName: string | undefined;
	friendUsername: string | undefined;
	friendAvatar: number | undefined;
	oldMessage: Message[] | undefined;
}>();

const friendIdRef = toRef(props, 'friendId');
const oldMessageRef = toRef(props, 'oldMessage');

import { io } from 'socket.io-client';

const socket = io(`ws://${WS_URL}`, {
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
		const { data } = await axios.get<Response<RoomResponse>>(
			`${BASE_URL}/message/room/${roomId}`
		);

		if (data.data === null) {
			await axios.post<Response<RoomResponse>>(`${BASE_URL}/message/room/add`, {
				roomId: roomId,
				user1Id: userId,
				user2Id: props.friendId,
			});
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
			if (users[props.friendId!]) {
				friendStatus.value = user.online;
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
	const roomId = `${[userId, props.friendId].sort().join('')}`;
	socket.emit('joinRoom', roomId);
});

watch(oldMessageRef, async () => {
	await nextTick();
	if (scrollTarget.value) {
		scrollTarget.value.scrollIntoView();
	}
});

function backHandler() {
	emit('updateFriend', null);
}
</script>

<template>
	<div
		class="flex flex-col min-w-[60vw] xl:h-screen w-[75vw]"
		v-if="props.friendId"
	>
		<div
			class="chat-header flex justify-between items-center px-8 min-h-[8vh] max-h-[8vh] bg-[#36393e]"
		>
			<div class="user-details flex items-center gap-4">
				<svg
					@click="backHandler"
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="white"
					class="bi bi-arrow-left-short hover:cursor-pointer"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
					/>
				</svg>
				<div class="avatar">
					<img
						:src="`https://api.dicebear.com/9.x/lorelei/svg?seed=${friendAvatar}`"
						alt="ava"
						class="max-h-[6vh]"
					/>
				</div>
				<div class="username flex flex-col">
					<h3 class="text-white text-xl font-semibold">
						{{ '@' + friendUsername }}
					</h3>
					<h4 class="text-sm text-gray-300">
						{{ friendStatus ? 'Online' : 'Offline' }}
					</h4>
				</div>
			</div>
		</div>
		<div
			class="chat-messages flex flex-col gap-4 p-4 overflow-auto bg-[#424549] h-[90vh] overflow-y-scroll"
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
	<div
		v-else
		class="flex flex-col items-center justify-center bg-[#424549] min-w-[60vw] xl:h-screen w-[75vw]"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="25"
			height="25"
			fill="white"
			class="bi bi-chat-dots-fill"
			viewBox="0 0 16 16"
		>
			<path
				d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"
			/>
		</svg>
		<h1 class="text-white mt-2 text-base font-semibold">No chat selected</h1>
		<h1 class="text-slate-200 text-sm">
			Select a conversation from the left menu
		</h1>
	</div>
</template>
