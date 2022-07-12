import Package from '../../package.json'
import Result from '../../utils/Result'
import Tracing from '../../utils/Tracing'

class Jwt {

    static generateAccessToken(payload, secret) {
        return new Result(Package.name, false, "", require('jsonwebtoken').sign(payload, secret))
    }

    static verifyAccessToken(token = "", secret) {
        try {
            return new Result(Package.name, false, "", require('jsonwebtoken').verify(token, secret))
        } catch (error) {
            Tracing.error(Package.name, error.toString())
            return new Result(Package.name, true, "Invalid token")
        }
    }

}

export default Jwt