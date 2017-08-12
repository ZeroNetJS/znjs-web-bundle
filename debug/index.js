module.exports = name => {
  return function () {
    const a = [...arguments]
    if (typeof a[0] == "string") {
      a[0] = name + " " + a[0]
    } else a.unshift(name)
    console.log.apply(console, a)
  }
}
