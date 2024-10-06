<script setup lang="ts">
import ChatInput from './ChatInput.vue';
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
				<div class="username">
					<h3 class="text-white text-xl font-bold">TEsSS</h3>
				</div>
			</div>
		</div>
		<div
			class="chat-messages flex flex-col gap-4 p-4 overflow-auto bg-[#424549] max-h-[71vh] min-h-[71vh]"
		>
			<div class="chat chat-start">
				<div class="chat-bubble bg-[#282b30] text-white">
					That's never been done in the history of the Jedi. It's insulting!
				</div>
			</div>
			<div class="chat chat-end">
				<div class="chat-bubble bg-[#36393e] text-white">
					Calm down, Anakin.
				</div>
			</div>
		</div>
		<ChatInput />
	</div>
</template>
