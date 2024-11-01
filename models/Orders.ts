import { Schema, Types, model } from 'mongoose';

const ordersSchema = new Schema({
    createdBy: {
        type: String,
        enum: ["admin", "user"],
        required: [true, "createdBy is required"]
    },
    carId: {
        type: String,
        required: [true, "carId is required"]
    },
    clientId: {
        type: String,
        required: [true, "clientId is required"]
    },
    orderType: {
        type: String,
        enum: ["rent", "oil change", "repair", "maintenance", "insurance"],
        required: [true, "orderType is required"]
    },
    time: {
        startDate: { type: String, required: [true, '"startDate" is required'] },
        endDate: { type: String, required: [true, '"endDate" is required'] }
    },
    cost: {
        type: Number,
        required: [true, "cost is required"]
    },
    adminApprove: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ["active", "inProgress", "completed"],
        default: "active",
    }
},
{ versionKey: false, timestamps: true })

const Orders = model('orders', ordersSchema)

export default Orders;