"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;class Color{static rgbToHsl(a,c,e){a/=255,c/=255,e/=255;var f,i,j=Math.max(a,c,e),k=Math.min(a,c,e),m=(j+k)/2;if(j===k)f=i=0;else{var l=j-k;i=.5<m?l/(2-j-k):l/(j+k);j===a?f=(c-e)/l+(c<e?6:0):j===c?f=(e-a)/l+2:j===e?f=(a-c)/l+4:void 0;f/=6}return[f,i,m]}static isHexColor(a){return"string"==typeof a&&6===a.length&&!isNaN(+("0x"+a))}}var _default=Color;exports.default=_default,module.exports=exports.default;