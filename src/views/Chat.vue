<script setup lang="ts">
import { ref } from 'vue';
import ChatContainer from '../components/ChatContainer.vue';
import Contacts from '../components/Contacts.vue';
import { Message } from '../types/Message';

const friendId = ref<string>();
const avatar = ref<number>();
const friendName = ref<string>();
const friendUsername = ref<string>();
const oldMessage = ref<Message[]>();

const setFriendId = (
	id: string,
	name: string,
	username: string,
	friendAvatar: number
) => {
	friendId.value = id;
	friendName.value = name;
	friendUsername.value = username;
	avatar.value = friendAvatar;
};

const sendOlderMessage = (message: Message[]) => {
	oldMessage.value = message;
};

const backHandler = () => {
	friendId.value = undefined;
};
</script>

<template>
	<div
		class="h-screen w-screen flex flex-row justify-center gap-4 items-center bg-[#1A120B] max-sm:gap-0"
	>
		<div class="flex flex-row">
			<Contacts
				v-on:send-friend-id="setFriendId"
				v-on:send-older-message="sendOlderMessage"
			/>
			<ChatContainer
				class="max-lg:hidden"
				v-on:updateFriend="backHandler"
				:friend-avatar="avatar"
				:friend-id="friendId"
				:old-message="oldMessage"
				:friend-name="friendName"
				:friend-username="friendUsername"
			/>
		</div>
	</div>
</template>
