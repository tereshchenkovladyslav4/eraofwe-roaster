import { PriceUnit, QuantityUnit } from '@enums';

export interface OrderSettings {
    sample_price: number;
    sample_quantity: number;
    sample_quantity_unit: QuantityUnit;
    token_amount: number;
    sample_price_currency: PriceUnit;
    token_amount_currency: PriceUnit;
}
