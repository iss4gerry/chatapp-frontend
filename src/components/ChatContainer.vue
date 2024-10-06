<script setup lang="ts">
import ChatInput from './ChatInput.vue';
</script>

<template>
	<div
		class="grid grid-rows-[10%_80%_10%] gap-0.5 overflow-hidden md:grid-rows-[15%_70%_15%]"
	>
		<div class="chat-header flex justify-between items-center px-8">
			<div class="user-details flex items-center gap-4">
				<div class="avatar">
					<img src="" alt="" class="h-12" />
				</div>
				<div class="username">
					<h3 class="text-white">TESS</h3>
				</div>
			</div>
			<Logout />
		</div>

		<div class="chat-messages flex flex-col gap-4 p-4 overflow-auto">
			<div class="message flex items-center">
				<div
					class="content max-w-[40%] md:max-w-[70%] break-words p-4 text-lg rounded-lg text-[#d1d1d1]"
				>
					<p></p>
				</div>
			</div>
		</div>

		<ChatInput />
	</div>
</template>
