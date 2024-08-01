import mongoose from 'mongoose';
import { 
        createUser, 
        getUserByIdentifier, 
        getUserById, 
        updateUser, 
        deleteUser 
      } from '../../services/user.service';
import UserModel, { IUser } from '../../models/User';
import User from '../../interfaces/User';

import bcrypt from 'bcryptjs';
import 'dotenv/config';
import connectToDatabase from '../../utils/dbConfig';
import { errorMessages } from '@utils/constants';

interface TestUser {
  userName: string;
  email: string;
  password: string;
  profileImage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const testUser: TestUser = {
  userName: 'JohnDoe',
  email: 'exmaple@email.com',
  password: 'password123',
  profileImage: 'profileImage',
  createdAt: new Date(),
  updatedAt: new Date(),
} as const;

const assertUser = (newUser: IUser | null, expectedUser: TestUser) => {
  expect(newUser).toBeDefined();
  expect(newUser).toHaveProperty('_id', expect.any(mongoose.Types.ObjectId));
  expect(newUser).toHaveProperty('userName', expectedUser.userName);
  expect(newUser).toHaveProperty('email', expectedUser.email);
  expect(newUser).toHaveProperty('password', expect.any(String));
  expect(newUser?.password).not.toEqual(expectedUser.password);
  expect(newUser).toHaveProperty('profileImage', expect.any(String));
  expect(newUser).toHaveProperty('createdAt', expect.any(Date));
  expect(newUser).toHaveProperty('updatedAt', expect.any(Date));
};
describe('User Service', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await UserModel.deleteMany({ $or: [{ userName: testUser.userName }, { email: testUser.email }] });
  });

  describe('Create User (C)', () => {
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
      await expect(createUser(invalidEmailUser)).rejects.toThrow(errorMessages.INVALID_FORM_DATA);
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
      await expect(createUser(takenUsernameUser)).rejects.toThrow(errorMessages.USERNAME_ALREADY_EXISTS);
    });

    it('should throw an error if email is already taken', async () => {
      await createUser(testUser);
      const takenEmailUser = {
        userName: 'newuser',
        email: testUser.email,
        password: 'password1234',
      };
      await expect(createUser(takenEmailUser)).rejects.toThrow(errorMessages.EMAIL_ALREADY_EXISTS);
    });
  });

  describe('Get User by email (R)', () => {
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

  describe('Get User by username (R)', () => {
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

  describe('Check password (R)', () => {
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

  describe('Update User (U)', () => {
    it('should update user by id', async () => {
        const newUser = await createUser(testUser);
        const updatedUserData = { ...newUser.toObject(), userName: 'UpdatedUserName' };
        const updatedUser = await updateUser(newUser._id, updatedUserData);
        expect(updatedUser).toHaveProperty('userName', 'UpdatedUserName');
    });
  });

  describe('Delete User (D)', () => {
    it('should delete a user by id', async () => {
      const newUser = await createUser(testUser);
      const deletedUser = await deleteUser(newUser.email);
      expect(deletedUser).toBe(true);
    });

    it('should return false if user is not found', async () => {
      const userName = "nonexistent";
      const deletedUser = await deleteUser(userName);
      expect(deletedUser).toBe(false);
    });
  });
});