import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, {
	retries: 3,
	retryDelay: (count) => {
		console.log('retry attempt: ' + count);
		return count * 2000;
	},
	retryCondition: (error) => {
		return (error.response && error.response.status >= 500) || !error.response;
	},
});

export default axios;
