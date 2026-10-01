import fs from 'node:fs';
const files = [
    'resources/js/admin/PaymentManagement.vue',
    'resources/js/admin/CategoryManagement.vue',
    'resources/js/admin/OrderManagement.vue',
    'resources/js/admin/ManageResources.vue',
    'resources/js/admin/Dashboard.vue',
    'resources/js/admin/MenuManagement.vue',
    'resources/js/components/ToastHost.vue',
];
for (const f of files) {
    let s = fs.readFileSync(f, 'utf8');
    const before = s;
    s = s.split('../../').join('../');
    fs.writeFileSync(f, s);
    console.log(f + ': ' + (before !== s ? 'fixed' : 'unchanged'));
}
