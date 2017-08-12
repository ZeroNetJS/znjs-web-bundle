"use strict"

window.ZeroNet = module.exports = function ZeroNet(config) {

  require("colors")

  let node
  //let dwait = require("./lib/hacky-logs.js")

  const MergeRecursive = require("merge-recursive")
  const ZeroNet = require("zeronet-node")

  const MEM = require("zeronet-storage-memory")

  const Common = require("./common")

  let cm

  const defaults = {
    swarm: {
      server: false,
      server6: false,
      protocol: {
        crypto: [
          require("zeronet-crypto/secio")
        ]
      }
    },
    node: {
      trackers: [
        //"zero://boot3rdez4rzn36x.onion:15441",
        //"zero://boot.zeronet.io#f36ca555bee6ba216b14d10f38c16f7769ff064e0e37d887603548cc2e64191d:15441",
        "udp://tracker.coppersurfer.tk:6969",
        "udp://tracker.leechers-paradise.org:6969",
        "udp://9.rarbg.com:2710",
        "http://tracker.opentrackr.org:1337/announce",
        "http://explodie.org:6969/announce",
        "http://tracker1.wasabii.com.tw:6969/announce"
        //"http://localhost:25534/announce"
      ]
    },
    nat: true,
    common: cm = new Common({
      debug: !!process.env.DEBUG
    }),
    storage: new MEM()
  }

  cm.logger("node")("Starting...")
  cm.title("ZeroNetJS - Starting...")

  const errCB = err => {
    if (!err && process.env.TESTOK) process.emit("SIGINT")
    if (!err) {
      cm.title("ZeroNetJS")
      return node.logger("node")("Started successfully")
    }
    cm.logger("node").fatal("The node failed to start")
    cm.logger("node").fatal(err)
    process.exit(2)
  }

  config = MergeRecursive(defaults, config)

  const Id = require("peer-id")

  const liftoff = (err, id) => {
    if (err) return errCB(err)
    config.id = id
    node = new ZeroNet(config)
    //dwait.map(d => d())
    //dwait = null
    node.start(errCB)
  }

  if (!config.id) {
    Id.create({
      bits: 2048
    }, liftoff)
  } else liftoff()

}
