import { apiFetch } from './lib/api.ts';
async function run() {
    try {
        const res = await apiFetch('');
        console.log("Success:", res);
    } catch (e) {
        console.log("Error:", e);
    }
}
run();
