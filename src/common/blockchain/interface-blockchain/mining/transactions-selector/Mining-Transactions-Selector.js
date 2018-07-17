import consts from 'consts/const_global'
import BufferExtended from "common/utils/BufferExtended";

class MiningTransactionsSelector{

    constructor(blockchain){
        this.blockchain = blockchain;
        this._transactions = [];
    }

    validateTransaction(transaction, miningFeeThreshold){

        if (miningFeeThreshold === undefined)
            miningFeeThreshold = consts.MINING_POOL.MINING.FEE_THRESHOLD;

        //don't upset the SPAM_GUARDIAN
        for (let j = 0; j < transaction.from.addresses.length; j++) {
            if (this._countAddresses(transaction.from.addresses[j].unencodedAddress, true, false) + 1 > consts.SPAM_GUARDIAN.TRANSACTIONS.MAXIMUM_IDENTICAL_INPUTS)
                throw {message: "too many inputs", from: transaction.from.addresses[j]};

            if (transaction.from.addresses[j].amount <= miningFeeThreshold / 2)
                throw {message: "transaction would not be included because the input is too small", from: transaction.from.addresses[j]};

        }

        for (let j = 0; j < transaction.to.addresses.length; j++) {
            if (this._countAddresses(transaction.to.addresses[j].unencodedAddress, false, true) + 1 > consts.SPAM_GUARDIAN.TRANSACTIONS.MAXIMUM_IDENTICAL_OUTPUTS)
                throw {message: "too many outputs", from: transaction.to.addresses[j]};

            if (transaction.to.addresses[j].amount <= miningFeeThreshold / 2)
                throw {message: "transaction would not be included because the input is too small", from: transaction.to.addresses[j]};

        }


    }

    selectNextTransactions(miningFeeThreshold){

        this._transactions = [];

        let size = consts.SETTINGS.PARAMS.MAX_SIZE.BLOCKS_MAX_SIZE_BYTES - 600;
        let i = 0;

        while (size > 0 && i < this.blockchain.transactions.pendingQueue.list.length ){

            let transaction = this.blockchain.transactions.pendingQueue.list[i];

            try {
                
                console.log(transaction.txId.toString("hex"));

                this.validateTransaction(transaction);

                let bRemoveTransaction = false;

                try {

                    let blockValidationType = {
                        "take-transactions-list-in-consideration": {
                            validation: true,
                            transactions: this._transactions,
                        }
                    };

                    if (transaction.fee >= miningFeeThreshold)
                        if ( transaction.validateTransactionEveryTime(this.blockchain.blocks.length,  blockValidationType )) {

                            size -= transaction.serializeTransaction().length;

                            if (size >= 0)
                                this._transactions.push(transaction);

                        } else
                            bRemoveTransaction = true;



                } catch (exception){
                    console.warn('Error Including Transaction', exception);
                    bRemoveTransaction = true;
                }

                if (bRemoveTransaction)
                    ; //to nothing



            } catch (exception){

            }



            i++;
        }

        console.warn("--------------------------------");
        console.warn("pendingQueue", this.blockchain.transactions.pendingQueue.list.length);
        console.warn("Transactions selected for mining: ", this._transactions.length);
        console.warn("--------------------------------");

        return this._transactions;
    }

    _countAddresses( unencodedAddress, from=false, to=false){

        let count = 0;

        this._transactions.forEach((transaction)=>{

            if (from)
                transaction.from.addresses.forEach((address)=>{
                    if (BufferExtended.safeCompare(address.unencodedAddress, unencodedAddress))
                        count++;
                });

            if (to)
                transaction.to.addresses.forEach((address)=>{
                    if ( BufferExtended.safeCompare(address.unencodedAddress, unencodedAddress))
                        count++;
                })

        });

        return count;
    }

}

export default MiningTransactionsSelector;