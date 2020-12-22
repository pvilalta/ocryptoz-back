-- Revert ocryptoz:init from pg

BEGIN;

DROP VIEW "quantity_total_currency_market_pnl"
DROP VIEW "quantity_total_currency_market"
DROP VIEW "quantity_total_platform"
DROP VIEW "quantity_sell_platform"
DROP VIEW "quantity_buy_platform"
DROP VIEW "quantity_total"
DROP VIEW "quantity_sell"
DROP VIEW "quantity_buy"
DROP VIEW "currency_data"

DROP TABLE "platform_exchange"
DROP TABLE "currency_direct"
DROP TABLE "currency"
DROP TABLE "event"
DROP TABLE "wallet"
DROP TABLE "user"

COMMIT;
