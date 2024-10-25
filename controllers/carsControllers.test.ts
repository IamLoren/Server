import Car from '../models/Car'
import carsController from '../controllers/carsControllers'

jest.mock('../models/Car')
jest.mock('../models/Car', () => ({
    find: jest.fn(),
}))

describe('getAllCars function', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test('should get cars list without request data', async () => {
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()
        const cars = [{}]

        ;(Car.find as jest.Mock).mockResolvedValue(cars)

        await carsController.getAllCars(req as any, res as any, next as any)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(cars)
    })
    test('should generate error when cars list was not received from data base', async () => {
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        ;(Car.find as jest.Mock).mockResolvedValue([])

        await carsController.getAllCars(req as any, res as any, next as any)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'List of cars was not founded'
        )
    })
})
