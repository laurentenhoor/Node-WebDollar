var assert = require('assert')

import InterfaceBlockchain from 'common/blockchain/interface-blockchain/blockchain/Interface-Blockchain'
import InterfaceBlockchainBlock from 'common/blockchain/interface-blockchain/blocks/Interface-Blockchain-Block'
import consts from 'consts/const_global'

describe('test save/load/remove blockchain to/from local storage', () => {

    let blockchain = null;
    let response = null;
    
    it('save/load/remove blockchain, sample test', async () => {

        blockchain = new InterfaceBlockchain();
        //create dummy blocks
        let b0 = new InterfaceBlockchainBlock( blockchain, 0, new Buffer(consts.BLOCKS_POW_LENGTH), new Buffer(consts.BLOCKS_POW_LENGTH), undefined, undefined, undefined, 0, blockchain.db );
        let b1 = new InterfaceBlockchainBlock( blockchain, 0, new Buffer(consts.BLOCKS_POW_LENGTH), new Buffer(consts.BLOCKS_POW_LENGTH), undefined, undefined, undefined, 1, blockchain.db );
        let b2 = new InterfaceBlockchainBlock( blockchain, 0, new Buffer(consts.BLOCKS_POW_LENGTH), new Buffer(consts.BLOCKS_POW_LENGTH), undefined, undefined, undefined, 2, blockchain.db );
        let b3 = new InterfaceBlockchainBlock( blockchain, 0, new Buffer(consts.BLOCKS_POW_LENGTH), new Buffer(consts.BLOCKS_POW_LENGTH), undefined, undefined, undefined, 3, blockchain.db );
        blockchain.blocks = [b0, b1, b2, b3];
        
        response = await blockchain.save();
        assert(response === true, 'save: ' + response);
        
        response = await blockchain.load();
        assert(response === true, 'load: ' + response);
        
        assert(blockchain.blocks[0].equals(b0), 'load: blocks differ after load');
        assert(blockchain.blocks[1].equals(b1), 'load: blocks differ after load');
        assert(blockchain.blocks[2].equals(b2), 'load: blocks differ after load');
        assert(blockchain.blocks[3].equals(b3), 'load: blocks differ after load');

        assert(blockchain.blocks.length === 4, 'load: blocks.length=' + blockchain.blocks.length);
        
        response = await blockchain.remove();
        assert(response === true, 'remove: ' + response);
    });

});
