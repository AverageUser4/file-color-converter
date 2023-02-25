const fileInput = document.querySelector('input[type="file"]');
const fromSelect = document.querySelector('#from');
const toSelect = document.querySelector('#to');
const outputTextarea = document.querySelector('#output');
const goButton = document.querySelector('button');

function onFileChange() {
  fileInput.files[0].text()
    .then(text => {
        outputTextarea.value = text;
    });
}

if(fileInput.files[0]) {
  onFileChange();
}
fileInput.addEventListener('change', onFileChange);

goButton.addEventListener('click', () => {
  if(fromSelect.value === toSelect.value) {
    return;
  }

  let usedRegExp;
  let usedCallback;

  switch(fromSelect.value) {
    case 'hexStr':
      usedRegExp = /#[0-9a-z]{6}/gi;
      break;

    case 'rgbStr':
      usedRegExp = /rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/gi;
      break;

    case 'rgbObj':
      usedRegExp = /WORK IN PROGRESS/gi;
      break;

    default:
      console.error('Unrecognized from!!!!!!');
  }

  switch(toSelect.value) {
    case 'hexStr':
      usedCallback = toHex.bind(null, fromSelect.value);
      break;

    case 'rgbStr':
      usedCallback = toRGB.bind(null, fromSelect.value, 'str');
      break;

    case 'rgbObj':
      usedCallback = toRGB.bind(null, fromSelect.value, 'obj');
      break;

    default:
      console.error('Unrecognized to!!!!!!');
  }

  const matchesArray = outputTextarea.value.match(usedRegExp);

  if(!matchesArray) {
    console.log('No matches.')
    return;
  }

  for(let match of matchesArray) {
    outputTextarea.value = outputTextarea.value.replace(match, usedCallback(match));
  }
});

function hexToDec(hexStr) {
  hexStr = hexStr.toLowerCase();
  if(hexStr.match(/[^0-9a-f]/g)) {
    throw new Error(`Incorrect argument in hexToDec, ${hexStr}`);
  }
  
  const values = { a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 };
  let dec = 0;
  let exponent = 0;

  for(let i = hexStr.length - 1; i >= 0; i--) {
    let digit = parseInt(hexStr[i]);
    if(Number.isNaN(digit)) {
      digit = values[hexStr[i]];
    }

    dec += digit * Math.pow(16, exponent);
    exponent++;
  }

  return dec;
}

function toRGB(inputType, outputType, value) {
  let r, g, b;

  console.log(inputType, outputType, value)
  
  if(inputType === 'hexStr') {
    r = hexToDec(value.slice(1, 3));
    g = hexToDec(value.slice(3, 5));
    b = hexToDec(value.slice(5, 7));
  }

  if(outputType === 'str') {
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    return `{ r: ${r}, g: ${g}, b: ${b} }`;
  }
}

function toHex(inputType, value) {
  let r, g, b;
  if(inputType === 'rgbStr') {
    [r, g, b] = value.match(/\d{1,3}/g);
  }

  r = parseInt(r).toString(16);
  g = parseInt(g).toString(16);
  b = parseInt(b).toString(16);

  return `#${r}${g}${b}`;
}