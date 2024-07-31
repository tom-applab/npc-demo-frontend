// Chatbot definitions 
const fontFamily = (fonts) => fonts.map(font => `'${font}'`).join(', ');

const styleSetShared = {
  primaryFont: fontFamily(['DIN Next LT W23', 'sans-serif']),
  bubbleBorderWidth: 0,
  bubbleFromUserBorderWidth: 0,
  sendBoxHeight: 50,
  sendBoxBorderTop: '0',
  enableUploadThumbnail: false,
  hideUploadButton: true
}

/* export const styleSetDark = {
  ...styleSetShared,
  backgroundColor: '#26292d',
  bubbleBackground: '#1C1F21',
  bubbleFromUserBackground: '#414141',
  bubbleFromUserTextColor: 'white',
  bubbleTextColor: 'white',
  sendBoxBackground: '#1C1F21',
  color: 'white',
  sendBoxTextColor: 'white'
} */

export const styleSetDark = {
  ...styleSetShared,
  backgroundColor: '#26292d',
  bubbleBackground: 'white',
  bubbleFromUserBackground: 'white',
  bubbleFromUserTextColor: 'white',
  bubbleTextColor: 'white',
  sendBoxBackground: '#1C1F21',
  color: 'white',
  sendBoxTextColor: 'white',
  hideUploadButton: true
}

/* export const styleSetLight = {
  ...styleSetShared,
  backgroundColor: '#FAFAFA',
  bubbleFromUserBackground: '#EDEDEC',
  color: '#000',
  sendBoxTextColor: '#000',
  sendBoxBackground: '#FFF',
  sendBoxPlaceholderColor: '#000'
} */

export const styleSetLight = {
  ...styleSetShared,
  backgroundColor: '#FAFAFA',
  bubbleBackground: 'white',
  bubbleFromUserBackground: 'white',
  color: '#000',
  sendBoxTextColor: '#000',
  sendBoxBackground: '#FFF',
  sendBoxPlaceholderColor: '#000',
  hideUploadButton: true
}