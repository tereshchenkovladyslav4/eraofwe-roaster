import { OrderStatus } from '@enums';
import { LabelValue } from '@models';

export const ORDER_STATUS_ITEMS: LabelValue[] = [
    { label: 'Placed', value: OrderStatus.Placed },
    { label: 'Shipped', value: OrderStatus.Shipped },
    { label: 'Order Confirmed', value: OrderStatus.Confirmed },
    { label: 'Payment', value: OrderStatus.Payment },
    { label: 'Harvest Ready', value: OrderStatus.HarvestReady },
    { label: 'Received', value: OrderStatus.Received },
];