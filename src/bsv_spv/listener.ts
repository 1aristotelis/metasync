require('dotenv').config();
import { log } from "../log";

import * as boostpow from "boostpow"

const { Listener } = require("bsv-spv");

export default async function main() {

    const ticker = "BSV";
    const blockheight = -10; // Number. If negative then it's number from the tip.
    const dataDir = __dirname;
    const port = 5251; // Same as Masters port above
    
    console.log("LISTENER DATA DIR", dataDir);
    const listener = new Listener({ name:'powco-test-listener', ticker, blockheight, dataDir });

    const onBlock = ({
        header,
        started,
        finished,
        size,
        height,
        txCount,
        transactions,
        startDate
    }) => {
        for (const [index, tx, pos, len] of transactions) {
            console.log(`#${index} tx ${tx.getTxid()} in block ${height}`)
        }
    }

    listener.on('mempool_tx', async ({ transaction, size }) => {
        try {

            const hex = transaction.toBuffer().toString("hex")

            const job = boostpow.BoostPowJob.fromRawTransaction(hex)

            const proof = boostpow.BoostPowJobProof.fromRawTransaction(hex)

            if (job) {
                
                console.log("JOB: ", job)
                // Create event
            }

            if (proof) {
                console.log("PROOF: ", proof)
                // Create event
            }

            /* console.log(
                `new mempool tx ${transaction.getTxid()} ${size.toLocaleString(
                  "en-US"
                )} bytes.`
            ); */
            
        } catch (error) {
           console.log("ERROR: ", error) 
        }
    })

    listener.on("block_reorg", ({ height, hash }) => {
        // Re-org after height
    })

    listener.on("block_saved", ({ height, hash }) => {
        listener.syncBlocks(onBlock)
    })

    listener.syncBlocks(onBlock)

    listener.connect({ port })
}

if (require.main === module) {

    main()

}
