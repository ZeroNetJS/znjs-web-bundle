"use strict"

window.ZeroNet = module.exports = function ZeroNetBrowser(config, cb) {

  require("colors")

  let node

  const MergeRecursive = require("merge-recursive")
  const ZeroNet = require("zeronet-node")

  const MEM = require("zeronet-storage-memory")

  const Common = require("./common")

  const defaults = {
    swarm: {
      protocol: {
        crypto: [
          require("zeronet-crypto/secio")
        ]
      },
      libp2p: {
        transport: []
      }
    },
    modules: {},
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
    common: new Common({
      debug: true
    }),
    storage: new MEM()
  }

  config = MergeRecursive(defaults, config)

  const Id = require("peer-id")

  const liftoff = (err, id) => {
    if (err) return cb(err)
    config.id = id
    node = new ZeroNet(config)
    cb(null, node)
  }

  if (!config.id) {
    Id.create({
      bits: 2048
    }, liftoff)
  } else liftoff()

}
