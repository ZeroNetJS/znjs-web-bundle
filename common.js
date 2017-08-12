"use strict"

function consolePrefix(f, p) {
  return function () {
    const a = [...arguments]
    if (typeof a[0] == "string") a.unshift("[" + p + "] " + a.shift())
    else a.unshift("[" + p + "]")
    f.apply(console, a)
  }
}

module.exports = function ZeroNetBrowserCommon(opt) {
  const self = this
  self.browser = true
  self.logger = name => {
    const l = consolePrefix(console.log, name)
    l.info = l
    l.log = l

    l.debug = opt.debug ? consolePrefix(console.info, "DEBUG/" + name) : () => {}
    l.trace = opt.debug ? consolePrefix(console.info, "TRACE/" + name) : () => {}

    l.warn = consolePrefix(console.warn, name)

    l.error = l.fatal = consolePrefix(console.error, name)

    return l
  }
  self.title=() => {}
}
