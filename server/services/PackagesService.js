import mysql from 'mysql';
import * as env from 'dotenv';


const Mysql = mysql;

class PackagesService {
    static con;

    constructor() {
        env.config();
        this.con = Mysql.createConnection({
            host: "localhost",
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: "postal_ir"
        });
    }

    fireGetAllPackagesQuery(){
        const getAllPackagesQuery = "SELECT * FROM Packages";

        return new Promise((resolve,reject) => {
            this.con.query(getAllPackagesQuery, async (err,result,field) => {
                if(err) throw err;
                resolve(result);
            });
        });
    }

    fireSinglePackageQuery(id){
        const singlePackageQuery = "SELECT * FROM Packages WHERE ID = " + id;
        return new Promise((resolve,reject) => {
            this.con.query(singlePackageQuery, async (err,result,field) => {
                if (err) throw err;
                resolve(result);
            });
        });
    }

    fireCreatePackageQuery(obj) {
        const {
            street_name,
            house_number,
            postal_code,
            adressed_name
        } = obj

        const createPackageQuery = `INSERT INTO Packages(street_name,house_number,postal_code,adressed_name) VALUES('${street_name}','${house_number}','${postal_code}','${adressed_name}')`;
        return new Promise((resolve,reject) => {
            this.con.query(createPackageQuery, async function(err, result, field) {
                if(err) throw err;
                resolve(result);
            });
        });
    }

    fireDeletePackageQuery(id) {
        const deletePackageQuery = "DELETE FROM Packages WHERE ID = " + id;
        return new Promise((resolve,reject) => {
            this.con.query(deletePackageQuery, async function(err, result, field) {
                if(err) throw err;
                resolve(result);
            });
        });
    }
}
const PackagesServiceInstance = new PackagesService();
Object.freeze(PackagesServiceInstance);

export default PackagesServiceInstance