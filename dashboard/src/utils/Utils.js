class Utils {

    static getSum(s = "") {
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);     
    }

}
export default Utils