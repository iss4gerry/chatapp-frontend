<script setup lang="ts">
import { ref } from 'vue';
import EmojiPicker from 'vue3-emoji-picker';
import 'vue3-emoji-picker/css'; // Import CSS agar tampilan emoji picker muncul

const message = ref('');
const showEmojiPicker = ref(false);
const emit = defineEmits(['message']);

const sendMessage = () => {
	if (message.value.trim()) {
		emit('message', message.value);
		message.value = '';
	}
};

const addEmoji = (emoji: { i: string }) => {
	message.value += emoji.i; // Menambahkan emoji ke input
	showEmojiPicker.value = false; // Tutup popup setelah memilih emoji
};
</script>

<template>
	<div
		class="min-h-[6vh] flex flex-row justify-center items-center bg-[#36393e] relative"
	>
		<!-- Emoji Button -->
		<div class="relative">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class="mr-2 cursor-pointer"
				@click="showEmojiPicker = !showEmojiPicker"
			>
				<path
					d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3.5 8c.828 0 1.5.671 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.671-1.5-1.5.672-1.5 1.5-1.5zm-7 0c.828 0 1.5.671 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.671-1.5-1.5.672-1.5 1.5-1.5zm3.501 10c-2.801 0-4.874-1.846-6.001-3.566l.493-.493c1.512 1.195 3.174 1.931 5.508 1.931 2.333 0 3.994-.736 5.506-1.931l.493.493c-1.127 1.72-3.199 3.566-5.999 3.566z"
					fill="white"
				/>
			</svg>

			<!-- Emoji Picker -->
			<div v-if="showEmojiPicker" class="absolute bottom-12 left-0 z-50">
				<EmojiPicker @select="addEmoji" />
			</div>
		</div>

		<!-- Input -->
		<input
			v-model="message"
			type="text"
			placeholder="Type here"
			@keydown.enter="sendMessage"
			class="input input-bordered input-sm w-full max-w-3xl bg-[#424549] text-white"
		/>

		<!-- Send Button -->
		<button @click="sendMessage" class="ml-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="25"
				height="25"
				viewBox="0 0 24 24"
			>
				<path
					d="M23 0l-4.5 16.5-6.097-5.43 5.852-6.175-7.844 5.421-5.411-1.316 18-9zm-11 12.501v5.499l2.193-3.323-2.193-2.176zm-8.698 6.825l-1.439-.507 5.701-5.215 1.436.396-5.698 5.326zm3.262 4.287l-1.323-.565 4.439-4.503 1.32.455-4.436 4.613zm-4.083.387l-1.481-.507 8-7.89 1.437.397-7.956 8z"
					fill="white"
				/>
			</svg>
		</button>
	</div>
</template>
