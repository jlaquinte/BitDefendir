/* Component for checking if the browser is on mobile or not */

export default () =>{
	return ( navigator.userAgent.match(/Android/i) || 
		navigator.userAgent.match(/BlackBerry/i) || 
		navigator.userAgent.match(/iPhone/i) || 
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
		navigator.userAgent.match(/IEMobile/i) )
}

const androidVersion = () => {
  const ua = navigator.userAgent
  return ua.indexOf("Android") >= 0 ?
    parseFloat(ua.slice(ua.indexOf("Android")+8)) :
    -1
}

const isAndroid = () => {
  const ua = navigator.userAgent
  return ua.indexOf("Android") >= 0
}

const isIOS = () => {
	return ( navigator.userAgent.match(/iPhone|iPad|iPod/i) )
}

const isIPhone = () => {
	return ( navigator.userAgent.match(/iPhone/i) )
}

export {androidVersion, isAndroid, isIOS, isIPhone}