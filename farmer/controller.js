const utils = require("../utility/util");
const User = require('../model/user.js')
const Crop = require('../model/crop')
const {Order} = require('../model/cart')


var farmerController = {

    addCrop: async function(req, res) {
        try {
            // const token = req.session.JWT_TOKEN;
            // if(!token) {
            //     return res.sendStatus(401)
            // }
            const { cropName, price, quantity, quality, description, imageUrl } = req.body;
            const farmer = req.user

            const farmerExist = await User.exists({ _id: farmer.id, userType: 'farmer' });

            if(!farmerExist) return res.status(200).json({ "status": false});

            const crop = new Crop({ cropName, price, quality, quantity, imageUrl,  description, farmerId: farmer.id });
            const cropProduct = await crop.save();
    
            if(!cropProduct) return res.status(200).json({ "status": "DB UPDATE FAILED!!" });

            return res.status(200).json({ "status": true, cropProduct })

        } catch(error) {
            console.log(error)
        }
    },
    updateCrop: async function(req, res) {
        try {
            // const token = req.session.JWT_TOKEN;
            // if(!token) {
            //     res.sendStatus(401)
            // }
            const { cropName, price, quantity, quality, description, imageUrl, cropId } = req.body;
            const farmer = req.user

            const farmerExist = await User.exists({ _id: farmer.id, userType: 'farmer' });

            if(!farmerExist) return res.status(200).json({ "status": false});

            const cropExist = await Crop.exists({ _id: cropId, farmerId: farmer.id });

            if(!cropExist) return res.status(200).json({ "status": false });
    
            var updateCrop = await Crop.updateOne({ _id: cropId, farmerId: farmer.id }, { cropName, price, quality, quantity, imageUrl, description })
    
            res.status(200).json({"status": true, crop: {cropName, price, quantity, quality, description, imageUrl, cropId}});

        } catch(error) {
            console.log(error)
            res.sendStatus(500)
        }

    },
    deleteCrop: async function(req, res) {
        try {   
            
            // const token = req.session.JWT_TOKEN;
            // if(!token) {
            //     return res.sendStatus(401)
            // }
            const { cropId } = req.body;
            const farmer = req.user

            const farmerExist = await User.exists({ _id: farmer.id, userType: 'farmer' });

            if(!farmerExist) return res.status(200).json({ "status": false});

            const cropExist = await Crop.exists({ _id: cropId, farmerId: farmer.id });

            if(!cropExist) return res.status(200).json({ "status": false });

            cropDeleted = await Crop.deleteOne({ _id: cropId })

            if(cropDeleted) return res.status(200).json({"status": true, "deleted": true})

            res.sendStatus(500)

        } catch(error){
            console.log(error)
            res.sendStatus(500)
        }

    },
    getCrop: async function(req, res) {
        try {
            // const token = req.session.JWT_TOKEN;
            // if(!token) {
            //     return res.sendStatus(401)
            // }
            const { cropId } = req.body;
            const farmer = req.user

            const farmerExist = await User.exists({ _id: farmer.id, userType: 'farmer' });

            if(!farmerExist) return res.status(200).json({ "status": false});
            var options = {
                farmerId: farmer.id,
            }
            if(cropId) options._id = cropId;
            const cropList = await Crop.find(options).select({ 'createdAt': 0, 'updatedAt': 0, 'farmerId': 0 })
            if(!cropList) res.status(200).json({"status": true, crop: [], size: 0})
            res.status(200).json({"status": true, crop: cropList, size: cropList.length})
        } catch(error) {
            console.log('Error ', error)
            res.sendStatus(500)
        }
    },
    myOrders: async function(req, res) {
        try {
           /* var user = req.user;

            var orderList = await Order.find({farmerId: user.id}).lean();

            if(!orderList) return res.status(200).json({status: false})

            res.status(200).json({status: true, orderList, length: orderList.length})*/
            var user = req.user;

            var orderList = await Order.find({farmerId: user.id}).populate({
                path: "crops.cropId",
                select: "cropName price farmerId imageUrl description",
                populate: {
                    path: "farmerId",
                    select: "firstName lastName address"
                }
            }).lean()
            
            if(!orderList) return res.status(200).json({status: false})
            orderList.forEach(order => {
                order.crops = order.crops[0]
            })
            //orderList.crops = orderList.crops[0]
            res.status(200).json({status: true, orderList, length: orderList.length})

        } catch(error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}

module.exports = farmerController;