import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Car from './Car'

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
        await Car.deleteMany()
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    test('should create a Carprofile with valid data', async () => {
        const car = new Car({
            make:"Mercedes",
            model:"S 350 d 4MATIC",
            year:"2024",
            type:"sedan",
            engine:4,
            fuel:"diesel",
            transmission:"manual",
            color:"green",
            img:"https://res.cloudinary.com/carsphoto/image/upload/v1728239023/cars/manufaktur_olive.webp",
            availability: [],
            price: {hour: 10, day: 200},
            isRemoved: true
        })

        const savedCar = await car.save();
        expect(savedCar._id).toBeDefined();
        expect(savedCar.make).toBe("Mercedes");
        expect(savedCar.model).toBe("S 350 d 4MATIC");
        expect(savedCar?.price?.hour).toBe(10);
        expect(savedCar.availability.length).toBe(0);
        expect(savedCar.isRemoved).toBe(true);
    }, 20000)

    test('should not create profile without data', async () => {
        const car = new Car({})

        await expect(car.save()).rejects.toThrow(mongoose.Error.ValidationError)
    }, 20000)

    test("should throw validation error for invalid enum values", async () => {
        const car = new Car({
          make: "Ford",
          model: "Mustang",
          year: "2021",
          type: "Coupe",
          engine: 5.0,
          fuel: "water", 
          transmission: "none",
          price: {
            hour: 15,
            day: 100,
          },
          color: "Red",
          img: "https://example.com/car.jpg",
        });
      
        await expect(car.save()).rejects.toThrow(mongoose.Error.ValidationError);
      });

      test("should set default values for availability and isRemoved", async () => {
        const car = new Car({
          make: "Honda",
          model: "Civic",
          year: "2019",
          type: "Sedan",
          engine: 2.0,
          fuel: "gasoline",
          transmission: "manual",
          price: {
            hour: 12,
            day: 60,
          },
          color: "Blue",
          img: "https://example.com/car.jpg",
        });
      
        const savedCar = await car.save();
        expect(savedCar.availability.length).toBe(0); 
        expect(savedCar.isRemoved).toBe(false); 
      });

      test("should update car fields after creation", async () => {
        const car = new Car({
          make: "BMW",
          model: "X5",
          year: "2022",
          type: "SUV",
          engine: 3.0,
          fuel: "diesel",
          transmission: "automatic",
          price: {
            hour: 20,
            day: 120,
          },
          color: "Black",
          img: "https://example.com/car.jpg",
        });
      
        await car.save();
      if (!car) {
        throw new Error(); 
      }
        car.color = "Gray";
        if(car.price)car.price.day = 130;
        await car.save();
      
        const updatedCar = await Car.findOne({ _id: car._id });
        expect(updatedCar?.color).toBe("Gray");
        expect(updatedCar?.price?.day).toBe(130);
      });

      test("should mark car as removed", async () => {
        const car = new Car({
          make: "Audi",
          model: "A4",
          year: "2020",
          type: "Sedan",
          engine: 2.0,
          fuel: "gasoline",
          transmission: "automatic",
          price: {
            hour: 18,
            day: 90,
          },
          color: "Silver",
          img: "https://example.com/car.jpg",
        });
      
        await car.save();
      
        car.isRemoved = true;
        await car.save();
      
        const removedCar = await Car.findOne({ _id: car._id });
        expect(removedCar?.isRemoved).toBe(true);
      });
})
