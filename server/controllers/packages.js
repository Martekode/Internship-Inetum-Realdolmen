import PackagesServiceInstance from "../services/PackagesService";

export const getPackages = async (req, res) => {
    let packages = await PackagesServiceInstance.fireGetAllPackagesQuery();
    res.send(packages);
}

export const getBook = async (req , res) => {
    //logic
    const { id } = req.params;
    let singlePackage = await BookServiceInstance.fireSinglePackageQuery(id);
    res.send(singlePackage);
};

export const createBook = (req , res) => {
    const { body } = req;
    PackagesServiceInstance.fireCreateBookQuery(body);
    res.send("Package created successfully");
    //logic
};

export const deletePackage = (req,res) => {
    // logic
}