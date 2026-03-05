import { createBooking } from "./app/actions/shop";

async function test() {
    console.log("Testing with +60123456789");
    const res1 = await createBooking({
        service_id: "76",
        staff_id: "3",
        date: "2026-03-03",
        start_time: "11:00",
        name: "Meow",
        number: "+60123456789",
        gender: "Male",
        email: "john@example.com"
    });
    console.log(res1);

    console.log("Testing with 60123456789 (no plus)");
    const res2 = await createBooking({
        service_id: "76",
        staff_id: "3",
        date: "2026-03-03",
        start_time: "11:30",
        name: "Meow",
        number: "60123456789",
        gender: "Male",
        email: "john@example.com"
    });
    console.log(res2);
}
test();
