import mysql from 'mysql';

const Mysql = mysql;

class PackagesService {
    static con;
    static getAllPackagesQuery = 'SELECT * FROM Packages';

    constructor() {
        this.con = Mysql.createConnection({
            host: "localhost",
            user: "ATOMIUM\\BDMCO56",
            password: "",
            database: "Postal_IR"
        });
    }

    fireGetAllPackagesQuery(){
        return new Promise((resolve,reject) => {
            this.con.query(this.getAllPackagesQuery, async (err,result,field) => {
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
    }
}
const PackagesServiceInstance = new PackagesService();
Object.freeze(PackagesServiceInstance);

export default PackagesServiceInstance