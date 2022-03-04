class Utils {
    static isCompatible(currentVersion, minimumVersion) {
        if (minimumVersion.split(".")[0] < currentVersion.split(".")[0]) {
            return true
        } else if (currentVersion.split(".")[0] == minimumVersion.split(".")[0]) {
            if (minimumVersion.split(".")[1] < currentVersion.split(".")[1]) {
                return true
            } else if (currentVersion.split(".")[1] == minimumVersion.split(".")[1]) {
                if (minimumVersion.split(".")[2] < currentVersion.split(".")[2] || currentVersion.split(".")[2] == minimumVersion.split(".")[2]) {
                    return true
                }
            }
        }
        return false
    }

    static generateSingleCodeUnique() {
        return Math.random().toString(36).slice(-8).toUpperCase()
    }

    static getSum(s = "") {
        return s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
    }

}

export default Utils