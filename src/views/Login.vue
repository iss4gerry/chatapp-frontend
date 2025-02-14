<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from '../api';
import { Response, LoginResponse } from '../types/Auth';
import { useRouter } from 'vue-router';

import * as CryptoJS from 'crypto-js';

const loginRequest = ref<boolean>(false);
const loginGuestRequest = ref<boolean>(false);
const invalidField = ref<boolean>(false);
const email = ref<string>();
const password = ref<string>();
const userInfo = ref<LoginResponse>();
const wrongPassword = ref<boolean>(false);
const alertStatus = ref<boolean>(false);
const userId = ref<string>();
const router = useRouter();

const BASE_URL = import.meta.env.VITE_BE_URL;

watch(wrongPassword, () => {
	setTimeout(() => {
		setTimeout(() => {
			wrongPassword.value = false;
			alertStatus.value = false;
		}, 1000);
		alertStatus.value = true;
	}, 4000);
});

watch(invalidField, () => {
	setTimeout(() => {
		setTimeout(() => {
			invalidField.value = false;
			alertStatus.value = false;
		}, 1000);
		alertStatus.value = true;
	}, 4000);
});

const loginButton = async () => {
	if (!email.value && !password.value) {
		invalidField.value = true;
		return;
	}
	try {
		loginRequest.value = true;
		const res = await axios.post<Response<LoginResponse>>(
			`${BASE_URL}/auth/login/`,
			{
				email: String(email.value),
				password: String(password.value),
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		userInfo.value = res.data.data;
		userId.value = res.data.data.id;
		const token = res.headers['authorization'];
		if (token) {
			const bearerToken = token.split(' ')[1];

			const encryptedToken = CryptoJS.AES.encrypt(
				bearerToken,
				import.meta.env.VITE_SECRET_KEY
			).toString();
			const encryptedUserId = CryptoJS.AES.encrypt(
				userId.value,
				import.meta.env.VITE_SECRET_KEY
			).toString();
			localStorage.setItem('token', encryptedToken);
			localStorage.setItem('userId', encryptedUserId);

			router.push('/');
		}
	} catch (error: any) {
		if (error.response) {
			const { status } = error.response.data;
			if (status === 400) {
				wrongPassword.value = true;
			} else {
				console.log('Internal server error please try again');
			}
		} else if (error instanceof Error) {
			console.error('Error message:', error.message);
		} else {
			console.error('Unknown error:', error);
		}
	} finally {
		loginRequest.value = false;
	}
};
function generateRandomGuestName() {
	const randomNumber = Math.floor(Math.random() * 10000);

	return `Guest_${randomNumber}`;
}

const loginAsGuest = async () => {
	try {
		loginGuestRequest.value = true;
		const res = await axios.post<Response<LoginResponse>>(
			`${BASE_URL}/auth/register`,
			{
				email: generateRandomGuestName() + '@gmail.com',
				name: generateRandomGuestName(),
				password: generateRandomGuestName(),
			}
		);

		userInfo.value = res.data.data;
		userId.value = res.data.data.id;
		const token = res.headers['authorization'];
		if (token) {
			const bearerToken = token.split(' ')[1];

			const encryptedToken = CryptoJS.AES.encrypt(
				bearerToken,
				import.meta.env.VITE_SECRET_KEY
			).toString();
			const encryptedUserId = CryptoJS.AES.encrypt(
				userId.value,
				import.meta.env.VITE_SECRET_KEY
			).toString();
			localStorage.setItem('token', encryptedToken);
			localStorage.setItem('userId', encryptedUserId);

			router.push('profile/create');
		}
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
	} finally {
		loginGuestRequest.value = false;
	}
};
</script>

<template>
	<div class="flex justify-center items-center w-screen h-screen">
		<div class="card text-primary-content h-[50vh]">
			<div class="max-sm:flex max-sm:justify-center max-sm:items-center">
				<div
					role="alert"
					class="animate__animated animate__fadeInDown alert alert-error absolute -mt-5 max-sm:-mt-5 max-sm:flex max-sm:flex-row max-sm:items-center max-sm:justify-center max-sm:w-[40vh]"
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
					<span>Error! Invalid email or password.</span>
				</div>
			</div>
			<div class="max-sm:flex max-sm:justify-center max-sm:items-center">
				<div
					role="alert"
					class="animate__animated animate__fadeInDown alert alert-error absolute -mt-5 max-sm:-mt-5 max-sm:flex max-sm:flex-row max-sm:items-center max-sm:justify-center max-sm:w-[40vh]"
					:class="{ 'animate__fadeOutUp animate__delay-s': alertStatus }"
					v-if="invalidField"
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
			<div class="card-body max-sm:w-[44vh] backdrop-blur-sm mt-10">
				<div class="flex flex-col justify-center items-center space-y-4 w-full">
					<h2 class="text-2xl font-semibold text-white">Login</h2>
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
						@click="loginButton"
					>
						<p v-if="!loginRequest">Login</p>
						<div
							class="flex flex-row justify-center items-center"
							v-if="loginRequest"
						>
							<span class="loading loading-spinner mr-1 -ml-2"></span>
							Loading
						</div>
					</button>
					<div class="flex flex-row w-[30vh] justify-between">
						<div class="flex flex-row justify-center items-center">
							<input type="checkbox" class="checkbox w-3 h-3 mr-1 bg-white" />
							<p class="text-xs text-white">Remember me</p>
						</div>
						<a href="#" class="text-xs text-white">Forgot Password</a>
					</div>
					<div class="flex flex-row items-center justify-center">
						<p class="text-xs mr-1 text-white">Dont have an account?</p>
						<router-link
							to="register"
							class="text-xs font-semibold text-gray-300"
							>Register</router-link
						>
					</div>
					<div class="divider text-xs text-white">Or sign with</div>
					<div class="flex flex-row flex-wrap w-[30vh] justify-between">
						<button
							class="btn w-[14vh] bg-[#424549] border-[#424549] text-gray-50"
						>
							Google
						</button>
						<button
							class="btn w-[14vh] bg-[#424549] border-[#424549] text-gray-50"
							:disabled="loginGuestRequest"
							@click="loginAsGuest"
						>
							<p v-if="!loginGuestRequest">Guest</p>
							<div
								class="flex flex-row justify-center items-center"
								v-if="loginGuestRequest"
							>
								<span class="loading loading-spinner mr-1 -ml-2"></span>
								Loading
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
