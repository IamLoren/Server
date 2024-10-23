import mongoose from 'mongoose'
import dotenv from 'dotenv'
import UserProfile from './UserProfile'

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
        await UserProfile.deleteMany()
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })

    test('should create a profile with userId', async () => {
        const userId = 'njhgfcgbjiu8y5f'
        const profile = new UserProfile({
            userId,
        })

        await profile.save()

        const foundProfile = await UserProfile.findOne({
            userId: 'njhgfcgbjiu8y5f',
        })
        expect(foundProfile?.userId).toBe('njhgfcgbjiu8y5f')
        expect(foundProfile).toBeTruthy()
        expect(foundProfile?.avatarURL).toBeNull()
        expect(foundProfile?.favorites.length).toBe(0)
        expect(foundProfile?.history.length).toBe(0)
        expect(foundProfile?.theme).toBe('light')
    }, 20000)

    test('should not create profile without userId', async () => {
        const profile = new UserProfile({})

        await expect(profile.save()).rejects.toThrow()
    }, 20000)

    test("should allow updating the avatarURL, favorites, and theme", async () => {
        const profile = new UserProfile({ userId: new mongoose.Types.ObjectId() });
        await profile.save();
      
        profile.avatarURL = "https://example.com/avatar.jpg";
        profile.favorites = [{ _id:"670d10e33ca6a0d02fc434a1",
            make:"Mercedes",
            model:"S 350 d 4MATIC",
            year:"2024",
            type:"sedan",
            engine:4,
            fuel:"diesel",
            transmission:"manual",
            color:"green",
            img:"https://res.cloudinary.com/carsphoto/image/upload/v1728239023/cars/manufaktur_olive.webp",
            availability: "",
            isRemoved: true}];
        profile.theme = "dark";
        await profile.save();
      
        const updatedProfile = await UserProfile.findOne({ userId: profile.userId });
      
        expect(updatedProfile?.avatarURL).toBe("https://example.com/avatar.jpg");
        expect(updatedProfile?.favorites[0].make).toBe("Mercedes");
        expect(updatedProfile?.theme).toBe("dark");
      });

})
