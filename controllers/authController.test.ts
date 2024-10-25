jest.mock('../services/authServices')
jest.mock('../models/UserProfile')
jest.mock('../models/UserCredentials')
jest.mock('jsonwebtoken')
jest.mock('bcrypt')
jest.mock('../services/HTTPError')
jest.mock('../services/authServices', () => ({
    signUp: jest.fn(),
    findUser: jest.fn(),
    setToken: jest.fn(),
}))

import authController from './authController'
import { findUser, signUp, setToken } from '../services/authServices'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import HttpError from '../services/HTTPError'
import UserProfile from '../models/UserProfile'
import UserCredentials from '../models/UserCredentials'
dotenv.config()

const { JWT_SECRET } = process.env

describe('registerfunction', () => {
    test('should create user with valid data', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: '12345678',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        const newUser = {
            _id: 'mockUserId123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            role: 'user',
        }
        const token = 'testToken'

        ;(findUser as jest.Mock).mockResolvedValue(null)
        ;(signUp as jest.Mock).mockResolvedValue(newUser)
        ;(UserProfile.prototype.save as jest.Mock).mockResolvedValueOnce(
            undefined
        )
        ;(jwt.sign as jest.Mock).mockReturnValue(token)

        await authController.register(req as any, res as any, next as any)

        expect(findUser).toHaveBeenCalledWith({
            email: 'test@example.com',
        })
        expect(signUp).toHaveBeenCalledWith(req.body)
        expect(UserProfile).toHaveBeenCalledWith({ userId: newUser._id })
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
            },
        })
    })

    test('should throw error if email already in use', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: '12345678',
            },
        }
        const res = {}
        const next = jest.fn()

        ;(findUser as jest.Mock).mockResolvedValue({
            email: 'test@example.com',
        })

        await authController.register(req as any, res as any, next as any)

        expect(next).toHaveBeenCalledWith(HttpError(409, 'Email in use'))
    })

    test('should call next with an error if signUp received error', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: '12345678',
            },
        }
        const res = {}
        const next = jest.fn()
        ;(findUser as jest.Mock).mockResolvedValue(null)
        ;(signUp as jest.Mock).mockRejectedValue(
            new Error('Registration error')
        )

        await authController.register(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe('Registration error')
    })

    test('should call next with an error if creating a userProfile received error', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: '12345678',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        ;(findUser as jest.Mock).mockResolvedValue(null)
        ;(signUp as jest.Mock).mockResolvedValue({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            _id: 'mockUserId123',
        })
        jest.spyOn(UserProfile.prototype, 'save').mockRejectedValue(
            new Error('Profile creation error')
        )

        await authController.register(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe('Profile creation error')
    })

    test('should call next with an error if required field is missing', async () => {
        const req = {
            body: {
                email: undefined,
                password: '12345678',
            },
        }
        const res = {}
        const next = jest.fn()

        await authController.register(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Email, password, firstName and lastName are required'
        )
    })

    test('should generate token with correct payload and expiration', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: '12345678',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'mockUserId123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            role: 'user',
        }

        ;(findUser as jest.Mock).mockResolvedValue(null)
        ;(signUp as jest.Mock).mockResolvedValue(mockUser)
        jest.spyOn(UserProfile.prototype, 'save').mockResolvedValue({})

        const jwtSignSpy = jest
            .spyOn(jwt, 'sign')
            .mockReturnValue('mockToken123')

        await authController.register(req as any, res as any, next as any)

        expect(jwtSignSpy).toHaveBeenCalledWith(
            { jwtPayload: mockUser._id },
            JWT_SECRET,
            { expiresIn: '12h' }
        )

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            token: 'mockToken123',
            user: {
                id: mockUser._id,
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                email: mockUser.email,
                role: mockUser.role,
            },
        })

        jwtSignSpy.mockRestore()
    })

    test('should generate error if JWT_SECRET variable is not available', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: '12345678',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'mockUserId123',
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            role: 'user',
        }

        ;(findUser as jest.Mock).mockResolvedValue(null)
        ;(signUp as jest.Mock).mockResolvedValue(mockUser)
        jest.spyOn(UserProfile.prototype, 'save').mockResolvedValue({})

        const jwtSignSpy = jest
            .spyOn(jwt, 'sign')
            .mockReturnValue('mockToken123')

        const originalJwtSecret = process.env.JWT_SECRET
        delete process.env.JWT_SECRET

        await authController.register(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'JWT_SECRET variable is not available'
        )

        process.env.JWT_SECRET = originalJwtSecret
    })
})

describe('loginfunction', () => {
    test('should login user with valid data', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: '12345678',
            },
        }
        const res = { json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'userId123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
        }
        const mockProfile = {
            userId: 'userId123',
            theme: 'light',
            avatarURL: 'avatar.jpg',
            favorites: [],
            history: [],
        }

        ;(findUser as jest.Mock).mockResolvedValue(mockUser)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
        ;(UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile)
        ;(jwt.sign as jest.Mock).mockReturnValue('mockToken123')

        await authController.login(req as any, res as any, next as any)

        expect(res.json).toHaveBeenCalledWith({
            token: 'mockToken123',
            user: {
                id: 'userId123',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user',
                theme: 'light',
                avatarURL: 'avatar.jpg',
                favorites: [],
                history: [],
            },
        })
    })

    test('should generate error when user was not founded', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: '12345678',
            },
        }
        const res = { json: jest.fn() }
        const next = jest.fn()

        ;(findUser as jest.Mock).mockResolvedValue(null)

        await authController.login(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'This user was not registered in Data Base'
        )
    })

    test('should generate error when password is not valid', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: '12345678',
            },
        }
        const res = { json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'userId123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
        }

        ;(findUser as jest.Mock).mockResolvedValue(mockUser)
        ;(bcrypt.compare as jest.Mock).mockRejectedValue(
            new Error('Invalid email or password')
        )

        await authController.login(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe('Invalid email or password')
    })

    test('should generate error if JWT_SECRET variable is not available', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: '12345678',
            },
        }
        const res = { json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'userId123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
        }

        ;(findUser as jest.Mock).mockResolvedValue(mockUser)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

        const jwtSignSpy = jest
            .spyOn(jwt, 'sign')
            .mockReturnValue('mockToken123')

        const originalJwtSecret = process.env.JWT_SECRET
        delete process.env.JWT_SECRET

        await authController.login(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'JWT_SECRET variable is not available'
        )

        process.env.JWT_SECRET = originalJwtSecret
    })

    test('should generate error when userProfile was not founded', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: '12345678',
            },
        }
        const res = { json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'userId123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
        }

        ;(findUser as jest.Mock).mockResolvedValue(mockUser)
        ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
        ;(jwt.sign as jest.Mock).mockReturnValue('mockToken123')
        jest.spyOn(UserProfile, 'findOne').mockRejectedValue(
            new Error('User profile was not founded')
        )

        await authController.login(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'User profile was not founded'
        )
    })
})

describe('getCurrent function', () => {
    test('should refresh user with valid data', async () => {
        const req = {
            user: {
                jwtPayload: 'userId123',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'userId123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            token: 'token',
        }
        const mockProfile = {
            userId: 'userId123',
            theme: 'light',
            avatarURL: 'avatar.jpg',
            favorites: [],
            history: [],
        }

        ;(UserCredentials.findOne as jest.Mock).mockResolvedValue(mockUser)
        ;(UserProfile.findOne as jest.Mock).mockResolvedValue(mockProfile)

        await authController.getCurrent(req as any, res as any, next as any)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            id: 'userId123',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            email: 'test@example.com',
            theme: 'light',
            avatarURL: 'avatar.jpg',
            favorites: [],
            history: [],
            token: 'token',
        })
    })
    test('should generate error if request doesnt have decoded userId', async () => {
        const req = {
            user: {},
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await authController.getCurrent(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Request doesnt have necessary property `user.jwtPayload` '
        )
    })
    test('should generate error if request doesnt user property', async () => {
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await authController.getCurrent(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Request doesnt have necessary property `user` '
        )
    })
    test('should generate error if user with such id was not fouded', async () => {
        const req = {
            user: {
                jwtPayload: 'userId123',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        ;(UserCredentials.findOne as jest.Mock).mockRejectedValue(
            new Error('User with such id was not fouded')
        )

        await authController.getCurrent(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'User with such id was not fouded'
        )
    })
    test('should generate error if user with such id was not fouded', async () => {
        const req = {
            user: {
                jwtPayload: 'userId123',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        const mockUser = {
            _id: 'userId123',
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'John',
            lastName: 'Doe',
            role: 'user',
            token: 'token',
        }

        ;(UserCredentials.findOne as jest.Mock).mockResolvedValue(mockUser)
        ;(UserProfile.findOne as jest.Mock).mockRejectedValue(
            new Error('User profile was not founded')
        )

        await authController.getCurrent(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'User profile was not founded'
        )
    })
})

describe('logout function', () => {
    test('should logout user with valid data', async () => {
        const req = {
            user: {
                jwtPayload: 'userId123',
            },
        }
        const res = { status: jest.fn().mockReturnThis(), end: jest.fn() }
        const next = jest.fn()
        
        ;(setToken as jest.Mock).mockImplementation(async () => {})

        await authController.logout(req as any, res as any, next as any)

        expect(res.status).toHaveBeenCalledWith(204)
        expect(res.end).toHaveBeenCalled()
        expect(setToken).toHaveBeenCalledWith('userId123')
    })
    test('should generate error if request doesnt have decoded userId', async () => {
        const req = {
            user: {},
        }
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await authController.logout(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Request doesnt have necessary property `user.jwtPayload` '
        )
    })
    test('should generate error if request doesnt user property', async () => {
        const req = {}
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        const next = jest.fn()

        await authController.logout(req as any, res as any, next as any)

        expect(next).toHaveBeenCalled()
        expect(next.mock.calls[0][0].message).toBe(
            'Request doesnt have necessary property `user` '
        )
    })
})
