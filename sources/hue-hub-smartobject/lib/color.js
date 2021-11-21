
import Chroma from 'chroma-js'

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
        let red = Chroma(color).rgb()[0]
        let green = Chroma(color).rgb()[1]
        let blue = Chroma(color).rgb()[2]
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

    static isHexColor(hex) {
        return typeof hex === 'string'
            && hex.length === 6
            && !isNaN(Number('0x' + hex))
    }
}

export default Color 