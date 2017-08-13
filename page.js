let running = false

const ZeroNet = require("./zeronet.js")

window.onerror = function (messageOrEvent, source, lineno, colno, error) {
  console.error(messageOrEvent == "Script Error." ? messageOrEvent : error.stack)
};

const $ = window.$ = require("jquery")
const moment = require("moment")

function consoleParse(t) {
  let rr = t.slice(1)
  const n = t[0].replace(/%[a-z]/g, function (str) {
    const r = rr.shift()
    if (typeof r == "undefined") return str
    return r
  })
  return [n].concat(rr)
}

$(document).ready(() => (function () {
  'use strict'

  function addToLog() {
    const d = moment(new Date()).format("HH:mm:ss.SSS[Z]")
    let t = [...arguments]
    if (typeof t[0] == "string") {
      t.unshift("[" + d + "] " + t.shift())
      t = consoleParse(t)
    } else {
      t.unshift("[" + d + "]")
    }
    t = t.join(" ").split("\n")
    t.forEach(t => {
      const d = $("<p></p>")
      let p = false
      t.split("").forEach(c => {
        const e = $("<span></span>")
        if (c != " ") p = true
        if (!p) e.css("margin-left", "9px")
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

  console.info("[node] Preparing to launch...")
  $("#node-state").text("Preparing...")

  ZeroNet({}, (err, node) => {
    if (err) throw err
    console.info("[node] Ready to launch")
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
          console.info("[node] Online")
        }
      })
    })
  })

}()))
