import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Orders from './Orders';

dotenv.config()

const { DB_TEST } = process.env
if (!DB_TEST) {
    throw new Error('DB_TEST environment variable is not defined')
}

describe('Orders Model', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(DB_TEST);
      console.log('DB CONNECTED!');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
    }
  });

  afterEach(async () => {
    await Orders.deleteMany(); 
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create and save an order successfully with valid data', async () => {
    const orderData = {
      createdBy: 'admin',
      carId: 'car123',
      clientId: 'client123',
      clientEmail: 'client@example.com',
      phoneNumber: '+1 123 456 7890',
      orderType: 'rent',
      time: {
        startDate: '2024-11-01T10:00:00Z',
        endDate: '2024-11-02T10:00:00Z'
      },
      cost: 100
    };

    const order = new Orders(orderData);
    const savedOrder = await order.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.createdBy).toBe(orderData.createdBy);
    expect(savedOrder.carId).toBe(orderData.carId);
    expect(savedOrder.clientId).toBe(orderData.clientId);
    expect(savedOrder.clientEmail).toBe(orderData.clientEmail);
    expect(savedOrder.phoneNumber).toBe(orderData.phoneNumber);
    expect(savedOrder.orderType).toBe(orderData.orderType);
    expect(savedOrder.time?.startDate).toBe(orderData.time.startDate);
    expect(savedOrder.time?.endDate).toBe(orderData.time.endDate);
    expect(savedOrder.cost).toBe(orderData.cost);
    expect(savedOrder.adminApprove).toBe(false);
    expect(savedOrder.orderStatus).toBe('active');
  });

  it('should fail to create an order without required fields', async () => {
    const order = new Orders({}); 

    let err;
    try {
      await order.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.createdBy).toBeDefined();
    expect(err.errors.carId).toBeDefined();
    expect(err.errors.clientId).toBeDefined();
    expect(err.errors.clientEmail).toBeDefined();
    expect(err.errors.phoneNumber).toBeDefined();
    expect(err.errors.orderType).toBeDefined();
    expect(err.errors['time.startDate']).toBeDefined();
    expect(err.errors['time.endDate']).toBeDefined();
    expect(err.errors.cost).toBeDefined();
  });

  it('should validate email format correctly', async () => {
    const invalidOrder = new Orders({
      createdBy: 'user',
      carId: 'car123',
      clientId: 'client123',
      clientEmail: 'invalidEmail',
      phoneNumber: '+1 123 456 7890',
      orderType: 'repair',
      time: { startDate: '2024-11-01T10:00:00Z', endDate: '2024-11-02T10:00:00Z' },
      cost: 200,
    });

    let err;
    try {
      await invalidOrder.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.clientEmail).toBeDefined();
    expect(err.errors.clientEmail.message).toContain('is invalid');
  });

  it('should validate phone number format correctly', async () => {
    const invalidOrder = new Orders({
      createdBy: 'user',
      carId: 'car123',
      clientId: 'client123',
      clientEmail: 'client@example.com',
      phoneNumber: '1234567890',
      orderType: 'maintenance',
      time: { startDate: '2024-11-01T10:00:00Z', endDate: '2024-11-02T10:00:00Z' },
      cost: 200,
    });

    let err;
    try {
      await invalidOrder.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.phoneNumber).toBeDefined();
    expect(err.errors.phoneNumber.message).toContain('is invalid');
  });

  it('should set default values for adminApprove and orderStatus', async () => {
    const orderData = {
      createdBy: 'admin',
      carId: 'car123',
      clientId: 'client123',
      clientEmail: 'client@example.com',
      phoneNumber: '+1 123 456 7890',
      orderType: 'oil change',
      time: { startDate: '2024-11-01T10:00:00Z', endDate: '2024-11-02T10:00:00Z' },
      cost: 300,
    };

    const order = new Orders(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.adminApprove).toBe(false);
    expect(savedOrder.orderStatus).toBe('active'); 
  });
});