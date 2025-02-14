<script setup lang="ts">
import { Response, LoginResponse } from '../types/Auth';
import axios from '../api';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const avatar = ref<number>();
const email = ref<string>();
const name = ref<string>();
const username = ref<string>();
const password = ref<string>();
const loginRequest = ref<boolean>(false);
const wrongPassword = ref<boolean>(false);
const alertStatus = ref<boolean>(false);

const BASE_URL = import.meta.env.VITE_BE_URL;

const router = useRouter();

watch(wrongPassword, () => {
	setTimeout(() => {
		setTimeout(() => {
			wrongPassword.value = false;
			alertStatus.value = false;
		}, 1000);
		alertStatus.value = true;
	}, 4000);
});

const register = async () => {
	if (email.value && username.value && password.value) {
		try {
			loginRequest.value = true;
			const { data } = await axios.post<Response<LoginResponse>>(
				`${BASE_URL}/auth/register`,
				{
					email: email.value,
					avatar: avatar.value,
					name: name.value,
					username: username.value,
					password: password.value,
				}
			);

			if (data.status === 200) {
				router.push('/login');
			} else {
				console.log(data.message);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log(error.message);
			}
		} finally {
			loginRequest.value = false;
		}
	} else {
		wrongPassword.value = true;
	}
};

onMounted(() => {
	avatar.value = undefined;
});

const generateAvatar = () => {
	return Math.floor(Math.random() * 50) + 1;
};

const avatars = ref(Array.from({ length: 6 }, () => generateAvatar()));

const shuffleAvatar = () => {
	avatars.value = Array.from({ length: 6 }, () => generateAvatar());
};

const setAvatar = (id: number) => {
	avatar.value = id;
};
</script>

<template>
	<div
		class="h-screen w-screen flex items-center justify-center"
		v-if="!avatar"
	>
		<div class="h-[50vh] w-[60vw] flex flex-col items-center justify-center">
			<h1 class="text-2xl font-semibold text-white text-center mb-4">
				Select your avatar
			</h1>
			<div
				class="min-h-[20vh] flex flex-wrap justify-center items-center w-screen p-2"
			>
				<div v-for="avatar in avatars" :key="avatar" class="avatar">
					<div
						@click="setAvatar(avatar)"
						class="w-20 rounded-full overflow-hidden m-4 hover:cursor-pointer hover:border-2 hover:border-white hover:w-24 duration-100"
					>
						<img
							:src="`https://api.dicebear.com/9.x/lorelei/svg?seed=${avatar}`"
							alt="Avatar"
						/>
					</div>
				</div>
			</div>
			<div class="mt-10 hover:cursor-pointer" @click="shuffleAvatar">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="white"
					class="bi bi-shuffle"
					viewBox="0 0 16 16"
				>
					<path
						fill-rule="evenodd"
						d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"
					/>
					<path
						d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"
					/>
				</svg>
			</div>
		</div>
	</div>

	<div class="flex justify-center items-center w-min-screen h-screen" v-else>
		<div class="card text-primary-content h-[50vh]">
			<div class="card-body max-sm:w-[44vh] backdrop-blur-sm">
				<div class="flex flex-col justify-center items-center space-y-4 w-full">
					<div class="flex flex-col items-center justify-center">
						<div
							role="alert"
							class="animate__animated animate__fadeInDown alert alert-error absolute -mt-20 max-sm:-mt-16 max-sm:flex max-sm:flex-row max-sm:items-center max-sm:justify-center max-sm:w-[40vh]"
							:class="{ 'animate__fadeOutUp animate__delay-s': alertStatus }"
							v-if="wrongPassword"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6 shrink-0 stroke-current"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>Please fill in all required fields </span>
						</div>
					</div>
					<h2 class="text-2xl font-semibold text-white">Register</h2>
					<label class="input input-bordered flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="h-4 w-4 opacity-70"
						>
							<path
								d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
							/>
							<path
								d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
							/>
						</svg>
						<input
							type="text"
							class="grow w-[25vh]"
							placeholder="Email"
							v-model="email"
						/>
					</label>
					<label class="input input-bordered flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="h-4 w-4 opacity-70"
						>
							<path
								d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
							/>
						</svg>
						<input
							type="text"
							class="grow w-[25vh]"
							placeholder="Name"
							v-model="name"
						/>
					</label>
					<label class="input input-bordered flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="h-4 w-4 opacity-70"
						>
							<path
								d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
							/>
						</svg>
						<input
							type="text"
							class="grow w-[25vh]"
							placeholder="Username"
							v-model="username"
						/>
					</label>
					<label class="input input-bordered flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 16 16"
							fill="currentColor"
							class="h-4 w-4 opacity-70"
						>
							<path
								fill-rule="evenodd"
								d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
								clip-rule="evenodd"
							/>
						</svg>
						<input
							type="password"
							class="grow w-[25vh]"
							placeholder="Password"
							v-model="password"
						/>
					</label>
					<button
						class="btn w-[31vh] bg-[#424549] border-[#424549] text-gray-50"
						:disabled="loginRequest"
						@click="register"
					>
						<p v-if="!loginRequest">Register</p>
						<div
							class="flex flex-row justify-center items-center"
							v-if="loginRequest"
						>
							<span class="loading loading-spinner mr-1 -ml-2"></span>
							Loading
						</div>
					</button>
					<div class="flex flex-row items-center justify-center">
						<p class="text-xs mr-1 text-white">Already have an account?</p>
						<router-link to="login" class="text-xs font-semibold text-gray-300"
							>Login</router-link
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
