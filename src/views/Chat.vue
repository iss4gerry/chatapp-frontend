<script setup lang="ts">
import { ref } from 'vue';
import ChatContainer from '../components/ChatContainer.vue';
import Contacts from '../components/Contacts.vue';
import { Message } from '../types/Message';

const friendId = ref<string>();
const friendName = ref<string>();
const friendUsername = ref<string>();
const oldMessage = ref<Message[]>();

const setFriendId = (id: string, name: string, username: string) => {
	friendId.value = id;
	friendName.value = name;
	friendUsername.value = username;
};

const sendOlderMessage = (message: Message[]) => {
	oldMessage.value = message;
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
				class="max-sm:hidden"
				:friend-id="friendId"
				:old-message="oldMessage"
				:friend-name="friendName"
				:friend-username="friendUsername"
			/>
		</div>
	</div>
</template>
