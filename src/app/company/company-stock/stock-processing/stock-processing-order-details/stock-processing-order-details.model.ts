import { ApiStockOrder } from '../../../../../api/model/apiStockOrder';

export interface ApiStockOrderSelectable extends ApiStockOrder {
    selected?: boolean;
    selectedQuantity?: number;
}
