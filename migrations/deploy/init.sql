
-- Deploy ocrypto: DB initialisation to pg

BEGIN;

-- USER -- 

CREATE TABLE "user"(
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "firstname" text,
    "lastname" text,
    "email" text NOT NULL UNIQUE,
    "password" text NOT NULL,
    "country" text
);

-- PORTFOLIO --

CREATE TABLE "wallet"(
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" text NOT NULL, 
    "is_default" boolean NOT NULL,
    "user_id" int NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

-- EVENT --

CREATE TABLE "event"(
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "type" text NOT NULL,
    "date" timestamptz NOT NULL,
    "platform_sending" text NOT NULL,
    "platform_receiving" text NOT NULL,
    "currency_asset" text NOT NULL,
    "currency_counterparty" text,
    "currency_fees" text,
    "quantity" float NOT NULL,
    "total_amount" float, -- espace
    "unit_price" float, -- espace 
    "fees" float NOT NULL DEFAULT 0,
    "note" text NULL,
    "ref_usd_amount" float NOT NULL DEFAULT 0,
    "ref_usd_fees" float NOT NULL DEFAULT 0,
    "wallet_id" INT NOT NULL REFERENCES wallet(id) ON DELETE CASCADE, --wallet_id
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CURRENCY --

CREATE TABLE "currency"(
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "slug" text NOT NULL, 
    "symbol" text NOT NULL, 
    "name" text NOT NULL, 
    "image" text NOT NULL,
    "is_needed" boolean NOT NULL DEFAULT false
);

-- CURRENCY DIRECT

CREATE TABLE "currency_direct"(
    "price" float,
    "currency_id" INT NOT NULL REFERENCES currency(id) ON DELETE CASCADE --currency_id
);

-- PLATFORM EXCHANGE

CREATE TABLE "platform_exchange"(
    "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "slug" text NOT NULL, 
    "name" text NOT NULL, 
    "image" text
);

-- SEEDING FIAT

INSERT INTO "currency" ("slug", "symbol", "name", "image") 
VALUES ('euro', 'eur', 'Euro', '//lelink');

INSERT INTO "currency" ("slug", "symbol", "name", "image") 
VALUES ('dollar', 'usd', 'Dollar', '//lelink');

-- VIEWS -- 

-- Currency data
CREATE OR REPLACE VIEW "currency_data" AS
SELECT 
currency.slug,
currency_direct.price
FROM currency_direct
JOIN currency ON currency_direct.currency_id = currency.id;

-- Quantity buy
CREATE OR REPLACE VIEW "quantity_buy" AS
SELECT 
event.currency_asset,
sum(event.quantity) AS quantity,
round(sum(event.ref_usd_amount)::numeric, 2) AS usd_amount,
round(sum(event.ref_usd_fees)::numeric, 2) AS usd_fees,
event.wallet_id
FROM event
WHERE event.type = 'buy'::text OR event.type = 'reward'::text
GROUP BY event.currency_asset, event.wallet_id;

-- Quantity sell
CREATE OR REPLACE VIEW "quantity_sell" AS
SELECT 
event.currency_asset,
sum(event.quantity) AS quantity,
round(sum(event.ref_usd_amount)::numeric, 2) AS usd_amount,
round(sum(event.ref_usd_fees)::numeric, 2) AS usd_fees,
event.wallet_id
FROM event
WHERE event.type = 'sell'::text
GROUP BY event.currency_asset, event.wallet_id;

-- Quantity total
CREATE OR REPLACE VIEW "quantity_total" AS
SELECT 
b.currency_asset AS asset,
CASE
WHEN b.currency_asset = s.currency_asset THEN b.quantity - s.quantity
ELSE b.quantity
END AS quantity,
CASE
WHEN b.currency_asset = s.currency_asset THEN b.usd_amount - s.usd_amount
ELSE b.usd_amount
END AS usd_amount,
CASE
WHEN b.currency_asset = s.currency_asset THEN b.usd_fees - s.usd_fees
ELSE b.usd_fees
END AS usd_fees,
b.wallet_id
FROM quantity_buy b
LEFT JOIN quantity_sell s ON b.wallet_id = s.wallet_id AND s.currency_asset = b.currency_asset;

-- Quantity buy platform
CREATE OR REPLACE VIEW "quantity_buy_platform" AS
SELECT 
event.currency_asset,
event.platform_receiving,
sum(event.quantity) AS quantity,
round(sum(event.ref_usd_amount)::numeric, 2) AS usd_amount,
round(sum(event.ref_usd_fees)::numeric, 2) AS usd_fees,
event.wallet_id
FROM event
WHERE event.type = 'buy'::text OR event.type = 'reward'::text
GROUP BY event.currency_asset, event.wallet_id, event.platform_receiving;

-- Quantity sell platform
CREATE OR REPLACE VIEW "quantity_sell_platform" AS
SELECT 
event.currency_asset,
event.platform_receiving,
sum(event.quantity) AS quantity,
round(sum(event.ref_usd_amount)::numeric, 2) AS usd_amount,
round(sum(event.ref_usd_fees)::numeric, 2) AS usd_fees,
event.wallet_id
FROM event
WHERE event.type = 'sell'::text
GROUP BY event.currency_asset, event.wallet_id, event.platform_receiving;

-- Quantity total platform
CREATE OR REPLACE VIEW "quantity_total_platform" AS
SELECT 
b.currency_asset AS asset,
b.platform_receiving AS exchange,
CASE
WHEN b.currency_asset = s.currency_asset AND b.platform_receiving = s.platform_receiving THEN b.quantity - s.quantity
ELSE b.quantity
END AS quantity,
CASE
WHEN b.currency_asset = s.currency_asset AND b.platform_receiving = s.platform_receiving THEN b.usd_amount - s.usd_amount
ELSE b.usd_amount
END AS usd_amount,
CASE
WHEN b.currency_asset = s.currency_asset AND b.platform_receiving = s.platform_receiving THEN b.usd_fees - s.usd_fees
ELSE b.usd_fees
END AS usd_fees,
b.wallet_id
FROM quantity_buy_platform b
LEFT JOIN quantity_sell_platform s ON b.wallet_id = s.wallet_id AND s.currency_asset = b.currency_asset;

-- Quantity total currency market
CREATE OR REPLACE VIEW "quantity_total_currency_market" AS
SELECT
CASE
WHEN quantity_total.asset = currency.slug THEN currency.image
ELSE NULL::text
END AS image,
quantity_total.asset,
quantity_total.quantity,
quantity_total.usd_amount,
quantity_total.usd_fees,
CASE
WHEN currency_data.slug = quantity_total.asset THEN round((quantity_total.quantity * currency_data.price)::numeric, 2)
ELSE NULL::numeric
END AS market_currency,
quantity_total.wallet_id
FROM quantity_total
LEFT JOIN currency_data ON currency_data.slug = quantity_total.asset
LEFT JOIN currency ON currency.slug = quantity_total.asset;

-- Quantity total currency market pnl
CREATE OR REPLACE VIEW "quantity_total_currency_market_pnl" AS
SELECT quantity_total_currency_market.image,
quantity_total_currency_market.asset,
round(quantity_total_currency_market.quantity::numeric, 2) AS quantity,
quantity_total_currency_market.usd_fees,
quantity_total_currency_market.usd_amount,
quantity_total_currency_market.market_currency,
round(quantity_total_currency_market.market_currency - (quantity_total_currency_market.usd_amount - quantity_total_currency_market.usd_fees), 2) AS pnl,
CASE
WHEN quantity_total_currency_market.market_currency IS NOT NULL THEN round((quantity_total_currency_market.market_currency - quantity_total_currency_market.usd_amount - quantity_total_currency_market.usd_fees) / (quantity_total_currency_market.usd_amount - quantity_total_currency_market.usd_fees + 0.01) * 100::numeric, 2)
WHEN quantity_total_currency_market.market_currency IS NULL THEN 0::numeric
ELSE NULL::numeric
END AS pnl_percentage,
quantity_total_currency_market.wallet_id
FROM quantity_total_currency_market
ORDER BY quantity_total_currency_market.usd_amount DESC;

COMMIT;