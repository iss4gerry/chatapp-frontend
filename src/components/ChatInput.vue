<template>
	<div
		class="grid items-center grid-cols-[5%_95%] bg-[#080420] px-8 md:px-4 gap-4"
	>
		<!-- Emoji Picker Button -->
		<div class="button-container flex items-center text-white gap-4"></div>

		<!-- Input Form -->
		<form
			class="input-container w-full flex items-center gap-8 bg-[#ffffff34] rounded-full"
		>
			<input
				type="text"
				placeholder="type your message here"
				class="w-[90%] h-[60%] bg-transparent text-white border-none pl-4 text-xl placeholder:text-white focus:outline-none"
			/>
			<button
				type="submit"
				class="bg-[#9a86f3] text-white flex justify-center items-center py-1 px-8 rounded-full"
			></button>
		</form>
	</div>
</template>
