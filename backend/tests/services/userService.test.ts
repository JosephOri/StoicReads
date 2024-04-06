import mongoose from 'mongoose';
import { createUser, getUserByEmail } from '../../src/services/userService';
import UserModel, { IUser } from '../../src/models/UserModel';
import User from '../../src/types/User'

describe('User Service', () => {

  beforeAll(async () => {
   await mongoose.connect('mongodb://localhost:27017/')
  
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userName = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';

      const user = {
        userName,
        email,
        password,
      }
      const newUser = await createUser(user);

      expect(newUser).toHaveProperty('_id');
      expect(newUser).toHaveProperty('userName', userName);
      expect(newUser).toHaveProperty('email', email);
      expect(newUser).toHaveProperty('password', expect.any(String));
      expect(newUser).toHaveProperty('createdAt', expect.any(Date));
      expect(newUser).toHaveProperty('updatedAt', expect.any(Date));
    });

    it('should throw an error if email is invalid', async () => {
      const userName = 'John Doe';
      const email = 'invalid-email';
      const password = 'password123';
      const user = {
        userName,
        email,
        password,
      }

      await expect(createUser(user)).rejects.toThrow('Error creating user: ValidationError: email: Invalid email');
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const userName = 'John Doe';
      const email = 'john@example.com';
      const password = 'password123';
      const userCreated = {
        userName,
        email,
        password,
      }

      const newUser = await createUser(userCreated);
      const userByEmail = await getUserByEmail(email);

      expect(userByEmail).toHaveProperty('_id', newUser._id);
      expect(userByEmail).toHaveProperty('userName', userName);
      expect(userByEmail).toHaveProperty('email', email);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';
      const user = await getUserByEmail(email);

      expect(user).toBeNull();
    });
  });
});