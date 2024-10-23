import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserCredentials from './UserCredentials'

dotenv.config()

const { DB_TEST } = process.env
if (!DB_TEST) {
    throw new Error('DB_TEST environment variable is not defined')
}

describe('insert', () => {
    beforeAll(async () => {
        try {
            await mongoose.connect(DB_TEST)
            console.log('DB CONNECTED!')
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error)
        }
    })

    afterEach(async () => {
        await UserCredentials.deleteMany()
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    test('should create a user with walid data', async () => {
        const user = new UserCredentials({
            firstName: 'John',
            lastName: 'Dou',
            email: 'john@example.com',
            password: 'asdfghjkl',
            terms: true,
        })

        await user.save()

        const foundUser = await UserCredentials.findOne({
            email: 'john@example.com',
        })
        expect(foundUser?.firstName).toBe('John')
    }, 20000)

    test('should not created user without data', async () => {
        const user = new UserCredentials({})

        await expect(user.save()).rejects.toThrow()
    }, 20000)

    test('should not create user with invalid password', async () => {
        const user = new UserCredentials({
            firstName: 'John',
            lastName: 'Dou',
            email: 'john@example.com',
            password: '123',
            terms: true,
        })

        await expect(user.save()).rejects.toThrow()
    }, 20000)

    test('should not create user with invalid email', async () => {
        const user = new UserCredentials({
            firstName: 'John',
            lastName: 'Dou',
            email: 'johnexample.com',
            password: 'asdfghjkl',
            terms: true,
        })

        await expect(user.save()).rejects.toThrow()
    }, 20000)

    test('should not create user without accepting terms and conditions', async () => {
        const user = new UserCredentials({
            firstName: 'John',
            lastName: 'Dou',
            email: 'johnexample.com',
            password: 'asdfghjkl',
        })

        await expect(user.save()).rejects.toThrow()
    }, 20000)

    test("should not create a user with a first name shorter than 2 characters", async () => {
        const user = new UserCredentials({
          firstName: "J",
          lastName: "Doe",
          email: "j.doe@example.com",
          password: "password123",
          terms: true,
        });
      
        await expect(user.save()).rejects.toThrow();
      });

      test("should not allow creating a user with a duplicate email", async () => {
        const user1 = new UserCredentials({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          terms: true,
        });
        await user1.save();
      
        const user2 = new UserCredentials({
          firstName: "Jane",
          lastName: "Smith",
          email: "john.doe@example.com",
          password: "password456",
          terms: true,
        });
      
        await expect(user2.save()).rejects.toThrow();
      });

      test("should not create a user without required fields", async () => {
        const user = new UserCredentials({
          firstName: "John",
      
          email: "john.doe@example.com",
          password: "password123",
          terms: true,
        });
      
        await expect(user.save()).rejects.toThrow(
          'lastName is required'
        );
      });
})
