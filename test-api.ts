import CryptoJS from "crypto-js";

const data = {
    date: "2026-03-03",
    email: "john@example.com",
    gender: "Male",
    name: "Meow",
    number: "+60123456789",
    service_id: "76",
    staff_id: "3",
    start_time: "11:00",
    undefined_val: undefined,
    null_val: null,
};

const sortedKeys = Object.keys(data).sort();
const sortedParams: Record<string, any> = {};
sortedKeys.forEach(key => {
    sortedParams[key] = (data as any)[key];
});
const signatureBody = JSON.stringify(sortedParams);
console.log(signatureBody);
