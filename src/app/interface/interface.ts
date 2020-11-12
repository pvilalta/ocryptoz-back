
/**
 * USER
 */

export interface UserInformations {
    [key: string]: number | string | undefined;

    id?: number,
    firstname: string,
    lastname: string,
    email: string,
    password: string,
    country: string
}

export interface UserInformationsEdit {
    [key: string]: number | string | undefined;

    id?: number,
    email?: string,
    password?: string,
    country?: string
}

/**
 * WALLET
 */

export interface WalletInformations {
    [key: string]: number | string | boolean | undefined;

    id?: number,
    name: string,
    is_default: boolean,
    user_id: number
}

export interface WalletInformationsEdit {
    [key: string]: number | string | boolean | undefined;

    id?: number,
    name?: string,
    is_default?: boolean
} 

/**
 * EVENT
 */

export interface SubmitEventInformations {
    [key: string]: number | string | boolean | Date |undefined;

    id?: number,
    type: string,
    date: Date,
    quantity: number,
    total_amount?: number,
    unit_price?: number,
    fees?: number,
    note?: string,
    platform_sending: string,
    platform_receiving: string,
    currency_asset: string,
    currency_counterparty?: string,
    currency_fees?: number,
    wallet_id: number
}

