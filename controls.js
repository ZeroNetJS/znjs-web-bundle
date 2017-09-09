const Zite = require("zeronet-zite")
const zhello = "1HeLLo4uzjaLetFx6NH3PMwFP3qbRbTf3D"
const disable = bt => bt.css("transition", ".5s").attr("disabled", true)

module.exports = function ($, node) {
  $("#add-hello").one("click", () => {
    disable($("#add-hello"))
    const z = new Zite({
      address: zhello
    }, node)
    z.start()
  })
}
