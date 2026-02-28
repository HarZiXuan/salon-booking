import { loginCustomer, registerCustomer } from './app/actions/auth';

async function run() {
    const regRes = await registerCustomer({
        contact: '+60126667777',
        password: 'password123',
        password_confirmation: 'password123',
        name: 'Test Customer',
        email: 'testcustomer@example.com'
    });
    console.log("REGISTER RESP:", JSON.stringify(regRes, null, 2));

    const loginRes = await loginCustomer({
        contact: '+60126667777',
        password: 'password123'
    });
    console.log("LOGIN RESP:", JSON.stringify(loginRes, null, 2));
}

run();
