class Color {

    static rgbToHsl(r, g, b){
        r /= 255, g /= 255, b /= 255
        var max = Math.max(r, g, b), min = Math.min(r, g, b)
        var h, s, l = (max + min) / 2
        if(max === min) {
            h = s = 0
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h, s, l];
    }

    static hexToLab(color) {
        let red = require('chroma-js')(color).rgb()[0]
        let green = require('chroma-js')(color).rgb()[1]
        let blue = require('chroma-js')(color).rgb()[2]
        let redC =  (red / 255)
        let greenC = (green / 255)
        let blueC = (blue / 255)
        let redN = (redC > 0.04045) ? Math.pow((redC + 0.055) / (1.0 + 0.055), 2.4): (redC / 12.92)
        let greenN = (greenC > 0.04045) ? Math.pow((greenC + 0.055) / (1.0 + 0.055), 2.4) : (greenC / 12.92)
        let blueN = (blueC > 0.04045) ? Math.pow((blueC + 0.055) / (1.0 + 0.055), 2.4) : (blueC / 12.92)
        let X = redN * 0.664511 + greenN * 0.154324 + blueN * 0.162028
        let Y = redN * 0.283881 + greenN * 0.668433 + blueN * 0.047685
        let Z = redN * 0.000088 + greenN * 0.072310 + blueN * 0.986039
        let x = X / (X + Y + Z)
        let y = Y / (X + Y + Z)
        return {
            x: x,
            y: y
        }
    }

    static xyBriToRgb(x, y, bri){
        let z = 1.0 - x - y;
        let Y = bri / 255.0; // Brightness of lamp
        let X = (Y / y) * x;
        let Z = (Y / y) * z;
        let r = X * 1.612 - Y * 0.203 - Z * 0.302;
        let g = -X * 0.509 + Y * 1.412 + Z * 0.066;
        let b = X * 0.026 - Y * 0.072 + Z * 0.962;
        r = r <= 0.0031308 ? 12.92 * r : (1.0 + 0.055) * Math.pow(r, (1.0 / 2.4)) - 0.055;
        g = g <= 0.0031308 ? 12.92 * g : (1.0 + 0.055) * Math.pow(g, (1.0 / 2.4)) - 0.055;
        b = b <= 0.0031308 ? 12.92 * b : (1.0 + 0.055) * Math.pow(b, (1.0 / 2.4)) - 0.055;
        let  maxValue = Math.max(r,g,b);
        r /= maxValue;
        g /= maxValue;
        b /= maxValue;
        r = r * 255;   if (r < 0) { r = 255 };
        g = g * 255;   if (g < 0) { g = 255 };
        b = b * 255;   if (b < 0) { b = 255 };
        return {
            r :r,
            g :g,
            b :b
        }
    }

    static isHexColor(hex) {
        return typeof hex === 'string'
            && hex.length === 6
            && !isNaN(Number('0x' + hex))
    }

    static rgbToHex(r, g, b) {
        
        return require('chroma-js').rgb(r,g,b).hex()
    }
}

export default Color 