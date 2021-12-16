declare class Jwt {

    static generateAccessToken(login: String, secret: String): String;
    static verifyAccessToken(token: String, secret: String): String;

}

export default Jwt



