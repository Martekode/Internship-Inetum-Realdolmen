import PackagesServiceInstance from "../services/PackagesService.js";

export const getAllPackages = async (req, res) => {
    let packages = await PackagesServiceInstance.fireGetAllPackagesQuery();
    res.send(packages);
}

export const getPackage = async (req , res) => {
    //logic
    const { id } = req.params;
    let singlePackage = await PackagesServiceInstance.fireSinglePackageQuery(id);
    res.send(singlePackage);
};

export const createPackage = (req , res) => {
    const { body } = req;
    PackagesServiceInstance.fireCreatePackageQuery(body);
    res.send("Package created successfully");
    //logic
};

export const deletePackage = (req,res) => {
    // logic
    const {id} = req.params;
    PackagesServiceInstance.fireDeletePackageQuery(id);
    res.send("Package deleted successfully");
}