<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import ChatInput from './ChatInput.vue';
import axios from '../api/index';
import { Response } from '../types/Friend';
import { Message, NewMessagePayload, RoomResponse } from '../types/Message';

const chats = ref<{ senderId: string; message: string }[]>([]);
const scrollTarget = ref<HTMLElement | null>(null);
const userId = localStorage.getItem('userId')?.trimEnd();
const props = defineProps(['friendId']);
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3000');

const sendMessage = async (message: string) => {
	const roomId = `${[userId, props.friendId].sort().join('')}`;
	// await axios.post<Response<RoomResponse>>(
	// 	'http://localhost:3000/message/room/add',
	// 	{
	// 		roomId: roomId,
	// 		user1Id: userId,
	// 		user2Id: props.friendId,
	// 	}
	// );

	socket.emit('joinRoom', roomId);

	sendContent({
		roomId,
		senderId: userId!,
		content: message,
	});

	chats.value.push({
		senderId: userId!,
		message: message,
	});
	console.log(chats.value);
};

function sendContent(payload: NewMessagePayload) {
	socket.emit('sendMessage', payload);
}

socket.on('newMessage', (message: Message) => {
	console.log('Pesan baru diterima:', message);
	if (message.senderId === props.friendId) {
		chats.value.push({
			senderId: message.senderId,
			message: message.content,
		});
	}
});

watch(chats.value, async () => {
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
					<h4 class="text-sm text-white">last online 15 minute ago</h4>
				</div>
			</div>
		</div>
		<div
			class="chat-messages flex flex-col gap-4 p-4 overflow-auto bg-[#424549] max-h-[71vh] min-h-[71vh] overflow-y-scroll"
		>
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
