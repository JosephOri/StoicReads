import { Request, Response } from 'express';
import { register } from '../../src/controllers/controller.auth';
import { createUser } from '../../src/services/service.user';

// Mock the createUser function
jest.mock('../../src/services/service.user', () => ({
  createUser: jest.fn(),
}));

describe('register', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new user and return 201', async () => {
    // Arrange
    const newUser = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };
    const userData = {
      userName: 'testuser',
      email: 'test@example.com',
      password: 'password',
    };
    (createUser as jest.Mock).mockResolvedValueOnce(newUser);

    const req = { body: userData } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Act
    await register(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
    expect(createUser).toHaveBeenCalledWith(userData);
  });

  it('should return 400 if an error occurs', async () => {
    const errorMessage = 'Failed to create user';
    (createUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const req = {
      body: {
        userName: 'testuser',
        email: 'test@example.com',
        password: 'password',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Act
    await register(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should return 400 if invalid user data is provided', async () => {
    // Arrange
    const req = {
      body: { email: 'test@example.com', password: 'password' },
    } as Request; // Missing userName
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Act
    await register(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please provide all required fields',
    });
    expect(createUser).not.toHaveBeenCalled();
  });
});
