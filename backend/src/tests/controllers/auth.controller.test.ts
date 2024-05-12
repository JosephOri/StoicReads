import { Request, Response } from 'express';
import { login, register } from '../../controllers/auth.controller';
import { createUser } from '../../services/user.service';
import { getUserTokens } from '../../services/auth.service';

jest.mock('../../services/user.service', () => ({
  createUser: jest.fn(),
}));

describe('register', () => {
  let req: Request;
  let res: Response;
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

  beforeEach(() => {
    req = { body: userData } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new user and return 201', async () => {
    (createUser as jest.Mock).mockResolvedValueOnce(newUser);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(newUser);
    expect(createUser).toHaveBeenCalledWith(userData);
  });

  it('should return 500 if an error occurs in creating user', async () => {
    const errorMessage = 'Failed to create user';
    (createUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should return 400 if invalid user data is provided', async () => {
    const invalidReq = {
      ...req,
      body: { ...req.body, email: undefined },
    } as Request;

    await register(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Please provide all required fields',
    });
    expect(createUser).not.toHaveBeenCalled();
  });
});

jest.mock('../../services/auth.service', () => ({
  getUserTokens: jest.fn(),
}));

describe('login', () => {
  let req: Request;
  let res: Response;
  const userData = {
    userName: 'testuser',
    password: 'password',
  };

  beforeEach(() => {
    req = { body: userData } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return tokens and 200 status on successful login', async () => {
    const tokens = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };
    (getUserTokens as jest.Mock).mockResolvedValueOnce(tokens);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tokens);
    expect(getUserTokens).toHaveBeenCalledWith('testuser', 'password');
  });

  it('should return 500 status if an error occurs in login', async () => {
    const errorMessage = 'Login failed';
    (getUserTokens as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
  });

  it('should return 400 status if required fields are missing', async () => {
    const invalidReq = {
      ...req,
      body: { ...req.body, password: undefined },
    } as Request;

    await login(invalidReq, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid credentials',
    });
    expect(getUserTokens).not.toHaveBeenCalled();
  });
});
