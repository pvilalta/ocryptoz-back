const fetchAPI = require('node-fetch');
import { isUnparsedPrepend } from "typescript";
import db from "../config/db"


export async function bodyControl(body: any) {

    if(!body.id && body.total_amount && body.unit_price) {
        throw new Error(
            'You have to choose either total amount or unit price to declare your event but not both at the same time'
        );
    }    
    
    // B&S + TOTAL AMOUNT
    if((body.type === 'buy' && body.total_amount) || (body.type === 'sell' && body.total_amount)) {

        // check if informations are conform
        await isBodyConform(body, formControl.buySellAmountFields)

        // get value of crypto in dollars
        const value = await bodyData(body)

        // define ref_usd_amount
        const usd_amount = body.total_amount * value.counterPartyInDollar;
        body.ref_usd_amount = parseInt(usd_amount.toFixed(2));

        // define unit_price
        body.unit_price = body.total_amount / body.quantity

        // define note
        if (!body.note) {body.note = '-'}

        // define ref_usd_fees
        if (!body.fees) {
          body.currency_fees = '-'
          body.fees = 0;
          body.ref_usd_fees = 0;
        } else {
          body.ref_usd_fees = body.fees * value.feesInDollar;
        }

        if(!body.created_at) {body.created_at = new Date}

        // add the currency into the DB to get prices --> if error with the DB, throw an error
        await isNeeded(body.currency_asset)

        // return body updated
        return body;
    }

    // B&S + UNIT PRICE
    if((body.type === 'buy' && body.unit_price) || (body.type === 'sell' && body.unit_price)) {

        // check if informations are conform
        await isBodyConform(body, formControl.buySellUnitFields)

        // get value of crypto in dollars
        const value = await bodyData(body)

        // define ref_usd_amount
        const usd_amount = body.unit_price * body.quantity * value.counterPartyInDollar;
        body.ref_usd_amount = parseInt(usd_amount.toFixed(2));

        // define total_amount
        body.total_amount = body.unit_price/ body.quantity

        // define note
        if (!body.note) {body.note = '-'}

        // define ref_usd_fees
        if (!body.fees) {
            body.currency_fees = '-'
            body.fees = 0;
            body.ref_usd_fees = 0;
        } else {
            body.ref_usd_fees = body.fees * value.feesInDollar;
        }

        if(!body.created_at) {body.created_at = new Date}
        
        // add the currency into the DB to get prices --> if error with the DB, throw an error
        await isNeeded(body.currency_asset)

        // return body updated
        return body;

    }

    // TRANSFER
    if(body.type === 'transfer') {

        // check if informations are conform
        await isBodyConform(body, formControl.transferFields)

        // get value of crypto in dollars
        const value = await bodyData(body)

        body.total_amount = 0;
        body.unit_price = 0;
        body.ref_usd_amount = 0;
        body.currency_counterparty = '-';


        // define note
        if (!body.note) {body.note = '-'}


        // define ref_usd_fees
        if (!body.fees) {
            body.currency_fees = '-'
            body.fees = 0;
            body.ref_usd_fees = 0;
        } else {
            body.ref_usd_fees = body.fees * value.feesInDollar;
        }

        if(!body.created_at) {body.created_at = new Date}

      // return body updated
      return body;

    }
    // REWARD
    if(body.type === 'reward') {

        // check if informations are conform
        await isBodyConform(body, formControl.rewardFields)

        // add the currency into the DB to get prices --> if error with the DB, throw an error
        await isNeeded(body.currency_asset)

        // define properties
        body.total_amount = 0;
        body.unit_price = 0;
        body.ref_usd_amount = 0;
        body.currency_counterparty = '-';
        body.currency_fees = '-'
        body.fees = 0;
        body.ref_usd_fees = 0;
        if (!body.note) {body.note = '-'}
        if (!body.created_at) {body.created_at = new Date}

      // return body updated
      return body;


    }




}

async function bodyData(body: any) {

    // get currency to convert
    const counterParty = body.currency_counterparty;
    const feeCurrency = body.currency_fees;

    // get formated date
    const convDate = dateFormat.timeFormat(body.date);

    // get counter party in dollar
    let counterPartyInDollar;
    if (!!counterParty) {
        counterPartyInDollar = await fetchConversion(
        counterParty,
        convDate.fiatDate,
        convDate.cryptoDate
        );
    }

    // get fees in dollar
    let feesInDollar;
    if (!!feeCurrency) {
        feesInDollar = await fetchConversion(
        feeCurrency,
        convDate.fiatDate,
        convDate.cryptoDate
        );
    }    

    return { counterPartyInDollar, feesInDollar };

}

const formControl = {

    buySellAmountFields: [
        'date',
        'quantity',
        'platform_sending',
        'platform_receiving',
        'currency_asset',
        'total_amount',
        'currency_counterparty',
    ],
    buySellUnitFields: [
        'date',
        'quantity',
        'platform_sending',
        'platform_receiving',
        'currency_asset',
        'unit_price',
        'currency_counterparty',
    ],
    transferFields: [
        'date',
        'quantity',
        'platform_sending',
        'platform_receiving',
        'currency_asset',
    ],
    rewardFields: ['date', 'quantity', 'platform_receiving', 'currency_asset'],

    requiredFields: (body: any, arrayControl: any) => {
        for (let elem of arrayControl) {
            if (!body[elem]) {
                const field = elem.replace('_', ' ');
                throw new Error(`${field} is missing`);
            }
        }
    },
}

const dateFormat = {

    // convert timestamp to DD-MM-YYYY
    convertDate: (inputFormat: any) => {
        function pad(s: any) {
        return s < 10 ? '0' + s : s;
        }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('-');
    },

    // convert timestamp to YYYY-MM-DD
    convertDate2: (inputFormat: any) => {
        function pad(s: any) {
        return s < 10 ? '0' + s : s;
        }
        var d = new Date(inputFormat);
        return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-');
    },

    // get formats fitting APIs
    timeFormat: (date: any) => {
        const cryptoDate = dateFormat.convertDate(new Date(date)); // cryptoAPI date
        const fiatDate = dateFormat.convertDate2(new Date(date)); // fiatAPI date

        return {
        cryptoDate,
        fiatDate,
        };
    },
}

async function fetchConversion(devise: string, fiatDate: string, cryptoDate: string) {
    if (devise === 'euro') {
        // fetch API
        const response = await fetchAPI(
          `https://api.exchangeratesapi.io/history?start_at=${fiatDate}&end_at=${fiatDate}&symbols=USD`
        );
  
        const formatedData = await response.json();
  
        if (!formatedData.rates) {
          throw new Error(
            'We apologize, we are not able to respond to your request'
          );
        }
  
        // returning value
        return formatedData.rates[fiatDate]['USD'];
    } else if (devise === 'usd') {
        // return current result
        return 1;
    } else {
        // fetch API
        const response = await fetchAPI(
          `https://api.coingecko.com/api/v3/coins/${devise}/history?date=${cryptoDate}`
        );
        const formatedData = await response.json();
  
        if (!formatedData.market_data) {
          throw new Error(
            'We apologize, we are not able to respond to your request'
          );
        }
  
        // returning value
        return formatedData.market_data.current_price['usd'];
    }
}

async function checkFund(body: any) {

    // find total (buy - sell) of all events
    const result = await db.query(
        `SELECT * FROM "quantity_total_platform" WHERE wallet_id = '${body.wallet_id}'`
      );

      // if user get some
      if (!!result.rows) {
        // defininig exchange
        let currentExchange = [];

        // into every exchange by crypto
        for (let elem of result.rows) {
          // pushing every exchange in a array
          currentExchange.push(elem.exchange);


            console.log('elem', elem);
            console.log('body', body);
            
            
          // if an exchange and currency match
          if (elem.asset === body.currency_asset && elem.exchange === body.platform_sending) {
            // if the quantity to sell is superior at what the user own -> error
            if (elem.quantity - body.quantity < 0) {
              throw new Error(
                `The quantity of ${body.currency_asset} that you own on ${body.platform_sending} is inferior of the quantity that you are trying to sell`
              );
            }
          }
        }

        // handling exchange's array
        const isTrue = currentExchange.includes(body.platform_sending);

        // if the platform does not exist in current user event -> error
        if (isTrue === false) {
          throw new Error(`You do not own any crypto on ${body.platform_sending}`);
        } else {
          // then if the platform exist into user's wallets, we must verify if user own the crypto into this platform
          // define array
          let checkCrypto = [];

          // for every events, if platform or asset does not match, push false into array
          for (let elem of result.rows) {
            if (elem.asset != body.currency_asset || elem.exchange != body.platform_sending) {
              checkCrypto.push(null);
              // else, push true
            } else {
              checkCrypto.push(true);
            }
          }
          // check if true value into array
          const isRealyTrue = checkCrypto.includes(true);

          // if it's false, so user does not own this crypto on this platform
          if (!isRealyTrue) {
            throw new Error(
              `You do not own ${body.currency_asset} on ${body.platform_receiving}`
            );
          }
        }
      } else {
        // if user try to sell for his first event -> error
        throw new Error(`You do not own any crypto yet`);
      }

}

async function isNeeded(currency: string) {
    // send info to Currency about the new currency to follow
    const result = await db.query(
      `UPDATE "currency" SET "is_needed" = true WHERE slug = '${currency}' RETURNING *; `
    );

    // error treatment if is_needed doest not work
    if (result.rowCount === 0) {
      throw new Error(
        'We apologize, we are not able to respond to your inquirie'
      );
    }
}

async function isBodyConform(body: any, fields: any) {
    // checking required fields -> throw an error if problems
    formControl.requiredFields(body, fields)
    
    // checking if user get enough fund -> throw an error if problems
    if (body.type === 'sell' || body.type === 'transfer') {await checkFund(body)}
}

