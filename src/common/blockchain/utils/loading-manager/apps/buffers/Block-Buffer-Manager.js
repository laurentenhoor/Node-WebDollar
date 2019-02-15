import MemoryManager from "../../Memory-Manager"

class BlockBufferManager extends MemoryManager{

    async _loadData(height){
        return this.blockchain.db.get("block"+height);
    }

    async getData(height) {

        if (this.savingManager._pendingBlocks[height])
            return (await this.savingManager._pendingBlocks[height]).block.serializeBlock( false );

        if (this.loadingManager.blockManager._loaded[height])
            return (await this.loadingManager.blockManager._loaded[height]).serializeBlock( false );

        return MemoryManager.prototype.getData.call(this, height);

    }



}

export default BlockBufferManager;