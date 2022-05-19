const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CropSchema = new Schema({
    cropName: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    quality: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    farmerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String
    }

},
{
    timestamps: { 
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
     }
});

module.exports = mongoose.model('Crop', CropSchema);