<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { FriendList, Response } from '../types/Friend';
import { Message } from '../types/Message';

const userId = localStorage.getItem('userId')?.trimEnd();
const friendId = ref<string>('');
const friendList = ref<FriendList[]>();
const emit = defineEmits(['send-friendId', 'send-older-message']);

const fetchFriendList = async () => {
	const { data } = await axios.get<Response<FriendList[]>>(
		`http://localhost:3000/friend/list/${userId}`
	);

	friendList.value = data.data;
};

const friendData = async (id: string) => {
	friendId.value = id;

	const roomId = `${[userId, friendId.value].sort().join('')}`;
	emit('send-friendId', friendId.value);
	const message = await axios.get<Response<Message[]>>(
		`http://localhost:3000/message/${roomId}`
	);

	emit('send-older-message', message.data.data);
};

onMounted(() => {
	fetchFriendList();
});
</script>

<template>
	<div class="flex flex-col overflow-hidden bg-[#282b30]">
		<div
			class="flex flex-row min-w-full max-w-full min-h-[8vh] max-h-[8vh] items-center justify-center"
		>
			<h1 class="text-3xl text-white font-bold">Cwatt</h1>
		</div>

		<div
			class="flex flex-col min-h-[71vh] max-h-[70vh] min-w-full bg-[#36393e] items-center overflow-y-scroll"
		>
			<div v-for="(item, index) in friendList" :key="index">
				<div
					@click="friendData(item.friendId)"
					class="flex flex-row p-3 bg-[#424549] max-h-[10vh] min-h-[10vh] max-w-[46vh] min-w-[46vh] mt-4 items-center rounded-xl"
				>
					<img
						src="https://api.multiavatar.com/Binx Bond.svg"
						alt="ava"
						class="max-h-20 mr-10"
					/>
					<h1 class="text-white text-2xl font-bold">{{ item.friend.name }}</h1>
				</div>
			</div>
		</div>
		<div
			class="flex flex-row min-h-[6vh] max-h-[6vh] items-center justify-start"
		>
			<div class="avatar online ml-4">
				<div class="w-11 rounded-full">
					<img src="https://api.multiavatar.com/fea21f4c.svg" />
				</div>
			</div>
			<div class="flex flex-col ml-4">
				<h1 class="text-xs text-white font-semibold">Username</h1>
				<h1 class="text-xs text-white">Online</h1>
			</div>
		</div>
	</div>
</template>
