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
    clientEmail: {
        type: String,
        required: [true, "userEmail is required"],
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    phoneNumber: {
        type: String,
        required: [true, "phoneNumber is required"],
        match: /^\+1\s\d{3}\s\d{3}\s\d{4}$/,
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