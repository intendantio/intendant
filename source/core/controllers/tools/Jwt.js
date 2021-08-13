import jwt from 'jsonwebtoken'

class Jwt {

    static generateAccessToken(login,secret) {
        return jwt.sign(login, secret)
    }

    static verifyAccessToken(token = "",secret) {
        if (token.length === 0) {
            return {
                valid: false
            }
        }
        try {
            return {
                valid: true,
                login: jwt.verify(token, secret)
            }
        } catch (error) {
            return {
                valid: false
            }
        }
    }

}

export default Jwt