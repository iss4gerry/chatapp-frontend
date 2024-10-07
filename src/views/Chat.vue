<script setup lang="ts">
import { ref } from 'vue';
import ChatContainer from '../components/ChatContainer.vue';
import Contacts from '../components/Contacts.vue';

const friendId = ref<string>();

const setFriendId = (id: string) => {
	friendId.value = id;
};
</script>

<template>
	<div
		class="h-screen w-screen flex flex-col justify-center gap-4 items-center bg-[#131324]"
	>
		<div
			class="h-[85vh] w-[85vw] bg-[#00000076] grid grid-cols-[25%_75%] md:grid-cols-[35%_65%]"
		>
			<Contacts v-on:send-friend-id="setFriendId" />

			<ChatContainer :friend-id="friendId" />
		</div>
	</div>
</template>
