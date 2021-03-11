import { Menu } from '@models';

export const menuItems = [
    new Menu(1, 'dashboard', '/roaster-dashboard', null, null, null, false, 0, []),
    new Menu(2, 'sourcing', null, null, null, null, true, 0, ['sourcing-management']),
    new Menu(21, 'Green coffee sourcing', '/sourcing', null, null, null, false, 2, []),
    new Menu(22, 'Quality Control', '/features/green-grading', null, null, null, false, 2, []),

    new Menu(3, 'order_management', null, null, null, null, true, 0, ['sourcing-management']),
    new Menu(31, 'Purchase Orders Estates', '/orders/es', null, null, null, false, 3, []),
    new Menu(32, 'Orders & Requests by Micro Roasters', '/orders/mr', null, null, null, false, 3, []),
    new Menu(33, 'Customer Sales Orders', '', null, null, null, false, 3, []), // external link, TBD

    new Menu(4, 'Inventory', null, null, null, null, true, 0, [
        'coffee-management',
        'coffee-list',
        'products-management',
    ]),
    new Menu(
        41,
        'Green Coffee Inventory',
        '/green-coffee-management/green-coffee-inventory',
        null,
        null,
        null,
        false,
        4,
        [],
    ),
    new Menu(
        42,
        'Roasted Coffee Inventory',
        '/roasted-coffee-batch/roasted-coffee-batchs',
        null,
        null,
        null,
        false,
        4,
        [],
    ),
    new Menu(43, 'E-commerce Product Management', '/features/products-list', null, null, null, false, 4, []),
    new Menu(44, 'Product Settings', '/features/vat-management', null, null, null, false, 4, []),

    new Menu(5, 'Sales Management', null, null, null, null, true, 0, []),
    new Menu(51, 'Sales', './', null, null, null, false, 5, []),
    new Menu(52, 'Sales Contracts', '/sales-contract', null, null, null, false, 5, []),
    new Menu(53, 'Sales Tool', '/features/agreement', null, null, null, false, 5, []),
    new Menu(53, 'API Requests', '/api-requests-list', null, null, null, false, 5, []),

    new Menu(7, 'Brand & Experience', null, null, null, null, true, 0, []),
    new Menu(71, 'Brand Profile Management', '/brand-profile', null, null, null, false, 7, []),
    new Menu(72, 'End-User Experience', '/features/coffee-experience', null, null, null, false, 7, []),
    new Menu(73, 'Education & Collaboration', '/file-share', null, null, null, false, 7, []),
    new Menu(74, 'The Coffee Lab', '/features/q-a-forum', null, null, null, false, 7, []),
    new Menu(75, 'Social PR', '/features/social-media', null, null, null, false, 7, []),

    new Menu(8, 'Team Management', null, null, null, null, true, 0, [
        'acl-management',
        'acl-list',
        'user-management',
        'user-reports',
    ]),
    new Menu(81, 'Roles', '/team-management/manage-role', null, null, null, false, 8, ['acl-management', 'acl-list']),
    new Menu(82, 'User Settings', '/team-management/team-members', null, null, null, false, 8, [
        'user-management',
        'user-reports',
    ]),
    new Menu(83, 'customer_management', '/people/customer-management', null, null, null, false, 8, []),

    // Dropdown Menu
    new Menu(10001, 'roastery_profile', '/roastery-profile', null, null, null, false, 1000, []),
    new Menu(10002, 'my_profile', '/features/myprofile', null, null, null, false, 1000, []),
    new Menu(10003, 'account_settings', '/features/account-settings', null, null, null, false, 1000, []),
];
