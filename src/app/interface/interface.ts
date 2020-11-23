
/**
 * USER
 */

export interface newUserInt {
    [key: string]: number | string | undefined;

    firstname: string,
    lastname: string,
    email: string,
    password: string,
    country: string
}

export interface editUserInt {
    [key: string]: number | string | undefined;

    id?: number,
    email?: string,
    password?: string,
    country?: string
}

/**
 * WALLET
 */

export interface newWalletInt {
    [key: string]: number | string | boolean | undefined;

    name: string,
    is_default: boolean,
    user_id: number
}

export interface editWalletInt {
    [key: string]: number | string | boolean | undefined;

    id?: number,
    name?: string,
    is_default?: boolean
} 

/**
 * EVENT
 */

export interface newEventInt {
    [key: string]: number | string | boolean | Date | undefined;

    type: string,
    date: Date,
    quantity: number,
    total_amount: number,
    unit_price: number,
    fees: number,
    note: string,
    platform_sending: string,
    platform_receiving: string,
    currency_asset: string,
    currency_counterparty: string,
    currency_fees: number,
    wallet_id: number,
    ref_usd_amount: number,
    ref_usd_fees: number
}

