
import config from './config'

import { start as server } from './server'

import startSPV from "./bsv_spv/main"

export async function start() {

  if (config.get('http_api_enabled')) {

    //server();

  }

  startSPV()

}

if (require.main === module) {

  start()

}
