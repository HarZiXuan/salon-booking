const fs = require('fs');
let code = fs.readFileSync('components/venue/booking/wizard.tsx', 'utf8');

// Fix total amount
code = code.replace(
    /const totalAmount = selectedServiceObjects\.reduce\(\(acc, s\) => acc \+ s\.price, 0\);/g,
    'const totalAmount = selectedServiceObjects.reduce((acc, s) => acc + Number(s.price || 0), 0);'
);

// Fix selectedServiceObjects filter
code = code.replace(
    /const selectedServiceObjects = servicesData\.filter\(s => selectedServices\.includes\(s\.id\)\);/g,
    'const selectedServiceObjects = servicesData.filter(s => selectedServices.includes(String(s.id)));'
);

// Fix toggleService call in services list iteration
code = code.replace(/s\.categoryId \=\=\= cat\.id/g, 'String(s.categoryId) === String(cat.id)');
code = code.replace(/includes\(service\.id\)/g, 'includes(String(service.id))');
code = code.replace(/key=\{service\.id\}/g, 'key={String(service.id)}');
code = code.replace(/toggleService\(service\.id\)/g, 'toggleService(String(service.id))');

code = code.replace(/\{service\.name\}/g, '{String(service.name)}');
code = code.replace(/\{service\.duration\}/g, '{String(service.duration)}');
code = code.replace(/\{service\.description\}/g, '{String(service.description || "")}');
code = code.replace(/\{service\.price\}/g, '{String(service.price)}');

// Fix venue data rendering
code = code.replace(/src=\{venueData\.image\}/g, 'src={String(venueData.image || "")}');
code = code.replace(/\{venueData\.name\}/g, '{String(venueData.name)}');
code = code.replace(/\{venueData\.address\}/g, '{String(venueData.address)}');
code = code.replace(/\{venueData\.rating\}/g, '{String(venueData.rating || "5.0")}');
code = code.replace(/\{venueData\.reviews\}/g, '{String(venueData.reviews || "0")}');

// Fix selectedServiceObjects rendering
code = code.replace(/key=\{s\.id\}/g, 'key={String(s.id)}');
code = code.replace(/\{s\.name\}/g, '{String(s.name)}');
code = code.replace(/\{s\.duration\}/g, '{String(s.duration)}');
code = code.replace(/\{s\.price\}/g, '{String(s.price)}');
code = code.replace(/toggleService\(s\.id\)/g, 'toggleService(String(s.id))');

fs.writeFileSync('components/venue/booking/wizard.tsx', code);
