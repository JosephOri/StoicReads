import mongoose, { connect } from 'mongoose';
import { createUser, getUserByIdentifier } from '../../services/user.service';
import UserModel, { IUser } from '../../models/User';
import User from '../../interfaces/User';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import connectToDatabase from '../../utils/dbConfig';

const testUser = {
  userName: 'John Doe',
  email: 'exmaple@email.com',
  password: 'password123',
} as const;

const assertUser = (newUser: IUser | null, expectedUser: User) => {
  expect(newUser).toBeDefined();
  expect(newUser).toHaveProperty('_id', expect.any(mongoose.Types.ObjectId));
  expect(newUser).toHaveProperty('userName', expectedUser.userName);
  expect(newUser).toHaveProperty('email', expectedUser.email);
  expect(newUser).toHaveProperty('password', expect.any(String));
  expect(newUser?.password).not.toEqual(expectedUser.password);
  expect(newUser).toHaveProperty('profilePicture', expect.any(String));
  expect(newUser).toHaveProperty('createdAt', expect.any(Date));
  expect(newUser).toHaveProperty('updatedAt', expect.any(Date));
};
describe('User Service', () => {
  beforeAll(async () => {
    connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = await createUser(testUser);
      assertUser(newUser, testUser);
    });

    it('should throw an error if email is invalid', async () => {
      const invalidEmailUser = {
        userName: testUser.userName,
        email: 'invalidemail',
        password: testUser.password,
      };
      await expect(createUser(invalidEmailUser)).rejects.toThrow(
        'failed to create user'
      );
    });

    it('should throw an error if user already exists', async () => {
      await createUser(testUser);
      await expect(createUser(testUser)).rejects.toThrow(Error);
    });
    it('should throw an error if username is already taken', async () => {
      await createUser(testUser);
      const takenUsernameUser = {
        userName: testUser.userName,
        email: 'newemail@gmail.com',
        password: 'password1234',
      };
      await expect(createUser(takenUsernameUser)).rejects.toThrow(Error);
    });

    it('should throw an error if email is already taken', async () => {
      await createUser(testUser);
      const takenEmailUser = {
        userName: 'newuser',
        email: testUser.email,
        password: 'password1234',
      };
      await expect(createUser(takenEmailUser)).rejects.toThrow(Error);
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      await createUser(testUser);
      const userByEmail = await getUserByIdentifier(testUser.email);
      assertUser(userByEmail, testUser);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';
      const user = await getUserByIdentifier(email);

      expect(user).toBeNull();
    });
  });

  describe('getUserByUserName', () => {
    it('should return a user by username', async () => {
      await createUser(testUser);
      const userByUserName = await getUserByIdentifier(testUser.userName);
      assertUser(userByUserName, testUser);
    });

    it('should return null if user is not found', async () => {
      const userName = 'nonexistent';
      const user = await getUserByIdentifier(userName);

      expect(user).toBeNull();
    });
  });
  describe('comparePassword', () => {
    it('should return true if password is correct', async () => {
      const newUser = await createUser(testUser);
      expect(newUser.password).not.toEqual(testUser.password);
      expect(bcrypt.compareSync(testUser.password, newUser.password)).toBe(
        true
      );
    });
    it('should return false if password is incorrect', async () => {
      const newUser = await createUser(testUser);
      expect(bcrypt.compareSync('wrongpassword', newUser.password)).toBe(false);
    });
  });
});
