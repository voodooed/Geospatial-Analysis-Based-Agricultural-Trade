var User = require('../model/user')
const bcrypt = require('bcrypt');
const utils = require('../utility/util')

var authController = {
    register: async function(req, res) {
        try {
            console.log(JSON.stringify(req.body))
            const { email, firstName, lastName, contactNo, aadharNumber, panNo, gender, birthDate, password, confPass, address, userType, geo } = req.body

            if( password != confPass) return res.status(200).json({"status": false, "message": "Password and confirm password does not match"});

            const userEmailExist = await User.exists({email, userType})
            if(userEmailExist) return res.status(200).json({"status": false, "message": "Email Already Registered"});

            const user = new User({ email, firstName, lastName, contactNo, aadharNumber, panNo, gender, birthDate, password, address, userType, geoLocation: geo});

            const userSave = await user.save();

            const JWT_TOKEN = utils.generateAccessToken({id: user._id, email: user.email, userType: user.userType })

           // req.session.JWT_TOKEN = JWT_TOKEN;

            res.status(200).json({
                "status": true,
                "message": "register Successfull",
                "userDetail": {
                    firstName,
                    lastName,
                    accountType: userType ,
                    cartItemCount: 0
                },
                "JWTTOKEN": JWT_TOKEN
            });
        } catch(error) {
            console.log('err', error);
            res.sendStatus(500);
        }
        
    
    },
    login: async function(req, res) {
        try {

            const {email, password, userType} = req.body;

    
            const user = await User.findOne({email, userType});
    
            if(!user) return res.status(200).json({"status": false, "message": "email is not registered" });
    
            const passMatched = await bcrypt.compare(password, user.password);
     
            if(!passMatched) return res.status(200).json({"status": false, "message": "Incorrect Password" });
    
            const userDetail = { firstName: user.firstName, lastName: user.lastName, email: user.email, accountType: user.userType };

            const JWT_TOKEN = utils.generateAccessToken({id: user._id, email: user.email, userType: user.userType })

            console.log('sesion ', req.session.JWT_TOKEN)

            req.session.JWT_TOKEN = JWT_TOKEN;
    
            res.status(200).json({ 
                "status": true,
                "message": "Logged in Successfully",
                userDetail,
                "JWTTOKEN": JWT_TOKEN
                
            });
    
    
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    },
    logout: async function(req, res, next) {
        req.session.destroy(err => {
            if(err) {
                console.log(err)
                res.sendStatus(500)
            }
            res.status(200).json({message:"Logout Succesfull"})
        })
    }
}

module.exports = authController