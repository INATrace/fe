export interface SortOption {
    key: string;
    name: string;
    defaultSortOrder?: SortOrder;
    inactive?: boolean;
    selectAllCheckbox?: boolean;
    hide?: boolean;
}

export type SortOrder = 'ASC' | 'DESC';

export interface SortKeyAndOrder {
    key: string;
    sortOrder: SortOrder;
}
