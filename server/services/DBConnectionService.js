import mysql from 'mysql';
import * as env from 'dotenv';


const Mysql = mysql;

class DBConnectionService {
    static con;
    constructor(){
        env.config();
        this.con = Mysql.createConnection({
            host: "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: "postal_ir"
        });
    }

}

const DBConnectionServiceInstance = new DBConnectionService();
Object.freeze(DBConnectionServiceInstance);
export default DBConnectionServiceInstance;