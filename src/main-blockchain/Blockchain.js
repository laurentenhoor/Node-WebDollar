import MainBlockchainWallet from 'main-blockchain/wallet/Main-Blockchain-Wallet'
import MainBlockchain from 'main-blockchain/chain/Main-Blockchain'
import MainBlockchainMining from 'main-blockchain/mining/Main-Blockchain-Mining'
import MainBlockchainProtocol from 'main-blockchain/blockchain-protocol/Main-Blockchain-Protocol'
import MainBlockchainBalances from "main-blockchain/balances/Main-Blockchain-Balances";

class Blockchain{

    constructor(){

        this.Chain = new MainBlockchain();
        this.blockchain = this.Chain;

        this.Wallet = new MainBlockchainWallet(this.Chain);

        this.Mining = new MainBlockchainMining(this.Chain, undefined );

        this.Protocol = new MainBlockchainProtocol(this.Chain);

        this.Balances = new MainBlockchainBalances(this.Chain);

        this.Accountant = this.Chain.Accountant;

        this.Wallet.loadAddresses().then( async (response )=>{

            if (response === false || this.Wallet.addresses.length === 0)
                await this.Wallet.createNewAddress(); //it will save automatically

            this.Mining.setMinerAddress(this.Wallet.addresses[0].address);

        }).catch( async (exception)=>{
            console.log("exception loading Wallet.Addresses")

            this.Mining.setMinerAddress(await this.Wallet.getMiningAddress() );
        });




    }


}

export default new Blockchain()