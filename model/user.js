const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    lastName: {
        type: String,
        lowercase: true,
        trim: true
    },
    contactNo: {
        type: Number,
        required: true,
        unique: true        
    },
    aadharNumber: {
        type: Number,
        required: true,
        unique: true        
    },
    panNo: {
        type: String,
        required: true,
        unique: true        
    },
    gender: {
        type: String,
        required: true,
        enum: ['M', 'F']
    },
    birthDate: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 7,
        required: true
    }, 
    address: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true,
        enum: ['farmer', 'buyer'],
        default: 'buyer'
    },
    geoLocation: {
        lat: {type: Number, required: true},
        lon: {type: Number, required: true}
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

UserSchema.pre('save', function(next) {

    const user = this;

    if(!user.isModified('password')) return next();

    bcrypt.genSalt(4, function(err, salt) {
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
    
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);