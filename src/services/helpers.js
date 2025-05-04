import axios from 'axios';

export async function sendRequest(httpMethod, ...reqArgs) {
  if (!httpMethod || typeof httpMethod !== 'string') {
    throw new TypeError('Expect an HTTP method as 1st argument');
  } else if (reqArgs.length === 0) {
    throw new TypeError('Expect URL as 2nd argument');
  }

  const method = httpMethod.toLowerCase();

  if (
    method === 'post' &&
    (reqArgs.length === 1 || typeof reqArgs[1] !== 'object')
  ) {
    throw new TypeError(
      'Expect POST request body of type "object" as 3rd argument',
    );
  }

  try {
    return await axios[method](...reqArgs);
  } catch (error) {
    if (error.response?.data?.error) {
      if (error.response.data.error.message) {
        return error.response.data;
      }
      if (typeof error.response.data.error === 'string') {
        return { error: { message: error.response.data.error } };
      }
    }
    if (error.response?.data?.message) return { error: error.response.data };
    return {
      error: { message: 'Something went wrong! Please try again later.' },
    };
  }
}
