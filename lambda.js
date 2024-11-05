import { MongoClient } from 'mongodb';
import AWS from 'aws-sdk';
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

const mongoUri = process.env.MONGO_URI; 
const client = new MongoClient(mongoUri);
const ses = new AWS.SES({ region: 'eu-central-1' }); 

export const handler = async (event) => {
  try {
    await client.connect();
    const database = client.db('testing');
    const collection = database.collection('orders');

    const orders = await Orders.find({}).toArray();
    console.log(orders)
    const currentTime = new Date();
    
    for (const order of orders) {
      const endTime = new Date(order.endDate);

      const notificationTime = new Date(endTime.getTime() - 60 * 60 * 1000); 

      if (currentTime >= notificationTime && currentTime < endTime) {
    
        const params = {
          Destination: {
            ToAddresses: [order.userEmail],
          },
          Message: {
            Body: {
              Text: { Data: `Ваше замовлення закінчується о ${endTime}.` },
            },
            Subject: { Data: 'Нагадування про замовлення' },
          },
          Source: 'sender@example.com',
        };

        await ses.sendEmail(params).promise();
      }
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify({ message: 'Notifications sent successfully' }),
    };
    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error executing function', error: error.message }),
    };
  } finally {
    await client.close();
  }
};