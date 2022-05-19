const Crop = require("../model/crop");
const User = require("../model/user");
const {Cart, Order} = require("../model/cart");
const utils = require('../utility/util');
var farmerController = {

    cropList: async function(req, res) {
        try {

            var cropList = await Crop.distinct("cropName", {"quantity": { $gt: 0 }})
            
            res.status(200).json({"status": true, crops: cropList, length: cropList.length})

        } catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    getCropBuyersList: async function(req, res) {
        try {

            var user = req.user;

            var buyer = await User.findOne({_id: user.id, userType: user.userType}).lean();

            const cropName = req.body.cropName;

            var buyerGeolocation = buyer.geoLocation

            if(!cropName) return res.status(200).json({"status": false})

            const buyerList = await Crop.find({"cropName": cropName, "quantity": { $gt: 0 }}).populate({
                path: "farmerId",
                select: "firstName lastName contactNo address geoLocation"
            }).lean()

            buyerList.forEach(buyer => {
                var farmerLocation = buyer.farmerId.geoLocation;
                buyer.distanceFromFarmer = Number(utils.distance(buyerGeolocation.lat, buyerGeolocation.lon, farmerLocation.lat, farmerLocation.lon, 'K')).toFixed(2)+'Km'
            })

            return res.status(200).json({"status": true, cropList: buyerList, length: buyerList.length, buyerGeolocation})

        } catch(error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    getCartItems: async function(req, res) {
        const user = req.user;

        try {

            const cart = await Cart.findOne({ userId: user.id }).populate({
                path: "items.cropId",
                select: "cropName price farmerId imageUrl description",
                populate: {
                    path: "farmerId",
                    select: "firstName lastName address"
                }
            }).select({ "userId": 0 });
    
            res.status(200).json({
                cart
            });
    

        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    addCartItems: async function(req, res) {
        const  cropId = req.body.cropId;
        const  quantity = Number(req.body.quantity);

        const user = req.user;
        try {
        
            const cropDetails = await Crop.findById(cropId).lean();

            // Product Id doesn't exist in Product Collection
            if(!cropDetails) return res.status(200).json({
                status: false
            });

            if(quantity > cropDetails.quantity) {
                return res.status(200).json({"status": true, "message": "Quantity not available"})
            }

                // Fetch user Cart
            const cartDetails = await Cart.findOne({ userId: user.id });

            if(cartDetails) {
                // check if Product Id already exist 
                const indexFound = cartDetails.items.findIndex(item => item.cropId == cropId );

                // Remove item from the cart if quantity is set to zero
                if( indexFound !== -1 && quantity == 0) {
                    cartDetails.items.splice(indexFound, 1);
                    if(cartDetails.items.length == 0) {
                        cartDetails.subTotal = 0;
                    } else {
                        cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);
                    }
                } else if(quantity == -1 && cartDetails.items[indexFound].quantity + quantity == 0) {
                    cartDetails.items.splice(indexFound, 1);
                    if(cartDetails.items.length == 0) {
                        cartDetails.subTotal = 0;
                    } else {
                        cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);
                    }
                }
                else if(indexFound !== -1) {
                    cartDetails.items[indexFound].quantity = cartDetails.items[indexFound].quantity + quantity;
                    cartDetails.items[indexFound].total = cartDetails.items[indexFound].quantity * cropDetails.price;
                    cartDetails.items[indexFound].price = cropDetails.price;
                    cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);
                  //  await Crop.updateOne({_id: cropId}, {quantity: cropDetails.quantity - quantity})
                } else if (quantity > 0) {
                    cartDetails.items.push({
                        cropId,
                        quantity,
                        price: cropDetails.price,
                        total: parseInt(cropDetails.price * quantity)
                    });
                  // await Crop.updateOne({_id: cropId}, {quantity: cropDetails.quantity - quantity})

                    cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);

                } else {
                    return res.status(400).json({
                        "status": false
                    })
                }

                const data = await cartDetails.save();
                res.status(200).json({
                    "status" : true,
                    data: data
                })
            } else {
                const cartData = {
                    items: [{
                        cropId: cropId,
                        quantity: quantity,
                        price: cropDetails.price,
                        total: parseInt(cropDetails.price * quantity)
                    }],
                    subTotal: parseInt(cropDetails.price * quantity),
                    userId: user.id
                }

                const cartAdd = await Cart.create(cartData);
              //  await Crop.updateOne({_id: cropId}, {quantity: cropDetails.quantity - quantity})

                res.status(200).json({
                    "status": "Process Completed",
                    cartAdd
                })
            }
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    removeCartItems: async function(req, res) {
        const cropId = req.body.cropId;
        const user = req.user;
    
        try {
    
            const cart = await Cart.findOne({ userId: user.id });
    
            if(!cart) return res.status(200).json({ "status": true });
    
            const indexFound = cart.items.findIndex(item => item.cropId == cropId );
    
            if(indexFound !== -1) {
                cart.items.splice(indexFound, 1);
                    if(cart.items.length == 0) {
                        cart.subTotal = 0;
                    } else {
                        cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                    }
            }
    
            const cartSave = await cart.save();
    
            res.status(200).json({ "status": true,
                cartSave });
    
           
        } catch(error) {
            console.log(error);
            res.sendStatus(500);
        }
    },
    placeOrder: async function(req, res) {
        const user = req.user;
        try {
            
            const userDetails = await User.findOne({_id: user.id}).lean();

            const cartDetails = await Cart.findOne({ userId: user.id }).populate({
                path: "items.cropId" ,
                select: "cropName price"
            });


            if(!cartDetails || cartDetails.items.length == 0) return res.status(200).json({"status": "Invalid request"});

            let cartItems = cartDetails.items;

            let productList = [];

            for(item of cartItems) {

                let productOrder = {
                    cropId: item.cropId._id,
                    quantity: item.quantity,
                    price: item.cropId.price,
                    total: item.quantity * item.cropId.price
                };

                var cropDetails = await Crop.findOne({_id: item.cropId._id}).lean()

                await Crop.updateOne({_id: item.cropId._id}, {quantity: cropDetails.quantity - item.quantity})

                let finalOrder = new Order({
                    crops: productOrder,
                    userId: user.id,
                    address: userDetails.address,
                    status: "Processing",
                    subTotal: item.quantity * item.cropId.price,
                    farmerId:  cropDetails.farmerId
                })
                productList.push(finalOrder)

            }

            var orderSave = await Order.insertMany(productList);
           
            if(!orderSave) return res.status(200).json({ "status": false })

            cartDetails.items = [];
            cartDetails.subTotal = 0;

            const cartEmpty = await cartDetails.save();
            
            res.status(200).json({status: true, orderSave});
            
            

        } catch (err) {
            console.log(err)
            res.sendStatus(500);
        }
    },
    myOrders: async function(req, res) {
        try {

            var user = req.user;

            var orderList = await Order.find({userId: user.id}).populate({
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