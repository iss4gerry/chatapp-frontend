<script setup lang="ts">
import axios from '../api/index';
import { onMounted, ref } from 'vue';
import { AddFriend, FriendList, Response, SearchFriend } from '../types/Friend';
import { Message } from '../types/Message';
import { io } from 'socket.io-client';

const userId = localStorage.getItem('userId')?.trimEnd();
const friendId = ref<string>('');
const addFriendId = ref<string>();
const friendList = ref<FriendList[]>();
const addFriendView = ref<boolean>(true);
const searchFriendData = ref<SearchFriend>();
const friendNotFound = ref<boolean>(false);
const addFriendLoading = ref<boolean>(false);
const addFrindStatus = ref<boolean>(false);
const searchFriendId = ref<string>();
const userInfo = ref<{
	name: string;
	username: string;
}>();
const socket = io('ws://localhost:3000', {
	query: { userId },
});
const emit = defineEmits(['send-friendId', 'send-older-message']);

const fetchFriendList = async () => {
	const { data } = await axios.get<Response<FriendList[]>>(
		`http://localhost:3000/friend/list/${userId}`
	);

	if (data.data) {
		friendList.value = data.data;
		userInfo.value = data.data[0].user;
	}
};

const friendData = async (id: string, friendName: string, username: string) => {
	friendId.value = id;

	const roomId = `${[userId, friendId.value].sort().join('')}`;
	emit('send-friendId', friendId.value, friendName, username);
	const message = await axios.get<Response<Message[]>>(
		`http://localhost:3000/message/${roomId}`
	);

	socket.emit('joinRoom', roomId);
	emit('send-older-message', message.data.data);
};

const addFriend = () => {
	addFriendView.value = true;
};

const requestAddFrined = async () => {
	try {
		const { data } = await axios.post<Response<AddFriend>>(
			`http://localhost:3000/friend/add`,
			{
				userId: userId,
				friendId: addFriendId.value,
			}
		);

		if (data.status === 200) {
		}
	} catch (error) {}
};

const searchFriend = async () => {
	try {
		friendNotFound.value = false;
		const { data } = await axios.get<Response<SearchFriend>>(
			`http://localhost:3000/friend/search/${searchFriendId.value}`
		);

		if (data.data === null) {
			friendNotFound.value = true;
		} else {
			searchFriendData.value = data.data;
		}
	} catch (error) {}
};
onMounted(() => {
	fetchFriendList();
});
</script>

<template>
	<div
		class="flex flex-col overflow-hidden bg-[#282b30] w-[25vw] max-sm:bg-white max-sm:w-screen max-sm:h-screen max-lg:w-screen"
	>
		<div
			class="flex flex-row min-w-full max-w-full min-h-[8vh] max-h-[8vh] items-center justify-center bg-[#282b30]"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="currentColor"
				class="bi bi-person-fill-add flex-none opacity-0"
				viewBox="0 0 16 16"
			>
				<path
					d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
				/>
				<path
					d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
				/>
			</svg>
			<h1 class="text-3xl text-white font-semibold grow text-center">Cwatty</h1>
			<svg
				@click="addFriend"
				xmlns="http://www.w3.org/2000/svg"
				width="23"
				height="23"
				fill="gray"
				class="bi bi-person-fill-add flex-none mr-3 hover:cursor-pointer"
				viewBox="0 0 16 16"
			>
				<path
					d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
				/>
				<path
					d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
				/>
			</svg>
		</div>
		<div
			class="flex flex-col min-h-[86vh] max-h-[70vh] min-w-full bg-[#36393e] items-center overflow-y-scroll max-sm:max-h-[150vh] max-sm:min-h-[83vh]"
		>
			<div v-for="(item, index) in friendList" :key="index">
				<div
					@click="
						friendData(item.friendId, item.friend.name, item.friend.username)
					"
					class="flex flex-row p-3 bg-[#424549] h-[10vh] lg:min-w-[22vw] mt-4 items-center rounded-xl max-sm:w-[90vw] max-sm:h-[10vh] max-md:w-[90vw] max-lg:w-[85vw] max-lg:h-[15vh] hover:cursor-pointer hover:bg-[#3a3d41] hover:shadow-lg"
				>
					<img
						src="https://api.multiavatar.com/Binx Bond.svg"
						alt="ava"
						class="lg:max-h-20 mr-10 max-sm:h-[7vh] max-sm:mr-6 max-sm:ml-2 max-lg:h-[10vh] w-[8vh] xl:ml-2"
					/>
					<h1 class="text-white text-2xl font-semibold max-sm:text-lg">
						{{ item.friend.name }}
					</h1>
				</div>
			</div>
		</div>
		<div
			class="flex flex-row min-h-[6vh] max-h-[6vh] items-center bottom-0 bg-[#282b30] max-sm:max-h-[9vh] max-sm:min-h-[9vh]"
		>
			<div class="avatar online ml-4">
				<div class="w-11 rounded-full">
					<img src="https://api.multiavatar.com/fea21f4c.svg" />
				</div>
			</div>
			<div class="flex flex-col ml-4">
				<h1 class="text-xs text-white font-semibold">{{ userInfo?.name }}</h1>
				<h1 class="text-xs text-gray-300">Online</h1>
			</div>
		</div>
	</div>
	<div
		class="absolute w-[100vw] h-[100vh] z-10 inset-0 flex justify-center items-center"
		v-if="addFriendView"
	>
		<div class="absolute inset-0 bg-gray-800 opacity-50"></div>
		<div
			class="card bg-[#424549] w-90 shadow-xl flex flex-col justify-center items-center p-7"
		>
			<div class="w-full flex flex-row justify-between mb-5">
				<h1 class="text-2xl font-semibold text-white">Friend</h1>
				<svg
					@click="addFriendView = false"
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					fill="white"
					class="bi bi-x-lg hover:cursor-pointer"
					viewBox="0 0 16 16"
				>
					<path
						d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"
					/>
				</svg>
			</div>
			<div class="join">
				<button
					class="btn join-item bg-[#36393e] border-[#36393e] w-[15vh] font-normal text-white"
				>
					Connect with Friends
				</button>
				<button
					class="btn join-item bg-[#36393e] border-[#36393e] font-normal w-[15vh] text-white"
					disabled
				>
					Incomming Friend Request
				</button>
			</div>
			<div class="flex flex-col">
				<label
					class="input input-bordered flex items-center gap-2 mt-3 w-[30vh]"
				>
					<input
						v-model="searchFriendId"
						type="text"
						class="grow"
						placeholder="Search"
					/>
					<svg
						@click="searchFriend"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 16 16"
						fill="currentColor"
						class="h-4 w-4 opacity-70 hover:cursor-pointer"
					>
						<path
							fill-rule="evenodd"
							d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
							clip-rule="evenodd"
						/>
					</svg>
				</label>
			</div>
			<div class="mt-5 w-[30vh] h-[25vh]">
				<div
					class="flex flex-col items-center justify-center bg-[#36393e] h-full rounded-3xl"
				>
					<div
						v-if="!friendNotFound"
						class="flex flex-col justify-center items-center"
					>
						<img
							src="https://api.multiavatar.com/Binx Bond.svg"
							alt="ava"
							class="lg:max-h-20 max-sm:h-[7vh] max-sm:mr-6 max-sm:ml-2 max-lg:h-[10vh] w-[8vh]"
						/>
						<h1 class="text-lg font-semibold mt-2 text-white">
							{{ searchFriendData?.name }}
						</h1>
						<h1 class="text-sm text-white">
							{{ '@' + searchFriendData?.username }}
						</h1>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="white"
							class="bi bi-person-plus-fill mt-5 hover:cursor-pointer"
							viewBox="0 0 16 16"
						>
							<path
								d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
							/>
							<path
								fill-rule="evenodd"
								d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
							/>
						</svg>
					</div>
					<div v-else>
						<h1 class="text-white text-lg">User not found</h1>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
