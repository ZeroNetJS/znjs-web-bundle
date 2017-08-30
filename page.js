"use strict"

let running = false

require("debug").save("*")

const ZeroNet = require("./zeronet.js")

window.onerror = function (messageOrEvent, source, lineno, colno, error) {
  console.error(messageOrEvent == "Script Error." ? messageOrEvent : error.stack)
};

const $ = window.$ = require("jquery")
const moment = require("moment")
const Common = require("./common")

const COLSTART = "ȵ"
const COLEND = "ȶ"
const COLRESET = "ȷ"

function consoleParse(t) {
  let rr = t.slice(1)
  const n = t[0].replace(/%[a-z]/g, function (str) {
    const r = rr.shift()
    if (typeof r == "undefined") return str
    if (str.toLowerCase() == "%c")
      return COLSTART + r + COLEND
    return r
  })
  return [n].concat(rr)
}

function cssProcess(rules) {
  return rules.split(";").map(r => r.split(":").map(r => r.trim())).filter(v => v.length == 2)
}

$(document).ready(() => (function () {
  function addToLog() {
    const d = moment(new Date()).format("HH:mm:ss.SSS[Z]")
    let t = [...arguments]
    if (typeof t[0] == "string") {
      t.unshift("[" + d + "] " + t.shift())
      t = consoleParse(t)
    } else {
      t.unshift("[" + d + "]")
    }
    let css = ""
    let iscol = false
    let lc = ""
    let cc = ""
    t = t.join(COLRESET + " ").split("\n")
    t.forEach(t => {
      const d = $("<p></p>")
      let p = false
      t.split("").forEach(c => {
        lc = cc
        cc = c
        if (c == COLSTART)
          return (iscol = true)
        else if (c == COLEND)
          return (iscol = false)
        else if (c == COLRESET && lc != COLEND)
          return (css = "")
        if (iscol) return css += c
        const e = $("<span></span>")
        if (c != " ") p = true
        if (!p) e.css("margin-left", "9px")
        cssProcess(css).forEach(r => e.css(r[0], r[1]))
        if (c == " ") p = false
        e.text(c)
        d.append(e)
      })
      $("#logfield").append(d)
    })
  }

  ["log", "error", "warn", "info"].forEach(d => {
    const o = console[d].bind(console)
    console[d] = function console() {
      addToLog.apply(window, arguments)
      o.apply(console, arguments)
    }
  })

  console.info("%c[node]%c Preparing to launch...", "font-weight: bold", "color: inherit")
  $("#node-state").text("Preparing...")

  ZeroNet({
    debug: true,
    common: new Common({
      debug: true
    }),
    swarm: {
      libp2p: {
        wstar: ["/libp2p-webrtc-star/ip4/148.251.206.162/tcp/9090/ws/"]
      }
    }
  }, (err, node) => {
    if (err) throw err
    console.info("%c[node]%c Ready to launch", "font-weight: bold", "color: inherit")
    window.node = node
    $("#node-state").text("Node: Offline (Click to launch)")
    $("#node-state").click(() => {
      if (running) return
      running = true
      $("#node-state").text("Node: Starting...")
      node.start(err => {
        if (err) {
          $("#node-state").text("Node: Error")
          throw err
        } else {
          $("#node-state").text("Node: Online")
          console.info("%c[node]%c Online", "font-weight: bold", "color: inherit")
        }
      })
    })
  })

}()))
