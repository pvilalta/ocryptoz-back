
/**
 * USER
 */

export interface AccountInt {
    [key: string]: number | string | undefined;

    firstname: string,
    lastname: string,
    email: string,
    password: string,
    country: string
}

/**
 * WALLET
 */

export interface WalletInt {
    [key: string]: number | string | boolean | undefined;

    id?: number,
    name: string,
    is_default: boolean,
    user_id: number
}

/**
 * EVENT
 */

export interface EventInt {
    [key: string]: number | string | Date;

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
    ref_usd_fees: number,
    created_at: Date
}

