//this script contains methods of defining specific browsers
//according to this link: 
//https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser

let isIe11 = () => {
	return !!window.MSInputMethodContext && !!document.documentMode
}

let isIe10 = () => {
	return window.navigator.appVersion.indexOf("MSIE 10") !== -1
}

let isEdge = () => {
	return window.navigator.userAgent.indexOf("Edge") > -1
}

let isFirefox = () =>{
	return typeof InstallTrigger !== 'undefined'
}

export default {isIe11: isIe11, isFirefox: isFirefox, isEdge: isEdge, isIe10: isIe10};