
const Polyfills = {
  selectorMatch: (el, selector) => {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
  }
}

export default Polyfills