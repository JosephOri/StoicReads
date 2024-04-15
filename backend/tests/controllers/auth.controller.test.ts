import { Request, Response } from 'express';
import { register, login } from '../../src/controllers/auth.controller';
import { createUser } from '../../src/services/user.service';
import { getUserTokens } from '../../src/services/auth.service';

jest.mock('../../src/services/service.user', () => ({
  createUser: jest.fn(),
}));

describe('register', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new user and return 201', async () => {
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

    await register(req, res);

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

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should return 400 if invalid user data is provided', async () => {
    const req = {
      body: { email: 'test@example.com', password: 'password' },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please provide all required fields',
    });
    expect(createUser).not.toHaveBeenCalled();
  });
});

jest.mock('../../src/services/service.auth', () => ({
  getUserTokens: jest.fn(),
}));

describe('login', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return tokens and 200 status on successful login', async () => {
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    (getUserTokens as jest.Mock).mockResolvedValueOnce(tokens);

    const req = {
      body: {
        userName: 'testuser',
        password: 'password',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tokens);
    expect(getUserTokens).toHaveBeenCalledWith('testuser', 'password');
  });

  it('should return 400 status if an error occurs', async () => {
    const errorMessage = 'Invalid credentials';
    (getUserTokens as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const req = {
      body: {
        userName: 'testuser',
        password: 'password',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should return 400 status if required fields are missing', async () => {
    const req = {
      body: {
        userName: 'testuser',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith('All fields are required');
    expect(getUserTokens).not.toHaveBeenCalled();
  });
});
