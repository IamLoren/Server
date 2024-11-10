import { Schema, Types, model } from 'mongoose'

const carSchema = new Schema({
    make: {
        type: String,
        required: [true, '"Make" field is required'],
    },
    model: {
        type: String,
        required: [true, '"Model" field is required'],
    },
    year: {
        type: String,
        required: [true, '"Year" field is required'],
    },
    type: {
        type: String,
        required: [true, '"Type" field is required'],
    },
    engine: {
        type: Number,
        required: [true, '"Engine" field is required'],
    },
    fuel: {
        type: String,
        enum: ["gasoline", "diesel", "electric" , "hybrid"],
        required: [true, '"Fuel" field is required'],
    },
    transmission: {
        type: String,
        enum: ["manual", "automatic"],
        required: [true, '"Transmission" field is required'],
    },
    price: {
        hour: { type: Number, required: [true, '"Price per hour" is required'] },
        day: { type: Number, required: [true, '"Price per day" is required'] }
      },
    color: {
        type: String,
        required: [true, '"Color" field is required'],
    },
    img: {
        type: String,
        required: [true, '"Image" field is required'],
    },
    availability: {
        type: [ {
            orderId: String,
              startDate: String,
              endDate: String}
           ],
        default: [],
    },
    isRemoved: {
        type: Boolean,
        default: false,
    },
}, 
{ versionKey: false, timestamps: true }
)
const Car = model('cars', carSchema)

export default Car;