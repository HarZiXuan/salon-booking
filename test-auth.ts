import { loginCustomer } from './app/actions/auth';
async function run() {
    const res = await loginCustomer({ contact: '0123456789', password: 'password' });
    console.log(res);
}
run();
