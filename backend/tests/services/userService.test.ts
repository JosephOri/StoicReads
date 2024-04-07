import mongoose from 'mongoose';
import { createUser, getUserByEmail,getUserByUserName } from '../../src/services/userService';
import UserModel, { IUser } from '../../src/models/User';
import bcrypt from 'bcrypt';
import 'dotenv/config'

const testUser = {
  userName: 'John Doe',
  email: 'exmaple@email.com',
  password: 'password123',
}
describe('User Service', () => {
  beforeAll(async () => {
   const dbUri = process.env.MONGODB_URI as string;
   await mongoose.connect(dbUri)
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

      expect(newUser).toHaveProperty('_id');
      expect(newUser).toHaveProperty('userName', testUser.userName);
      expect(newUser).toHaveProperty('email', testUser.email);
      expect(newUser).toHaveProperty('password', expect.any(String));
      expect(testUser.password).not.toEqual(newUser.password);
      expect(newUser).toHaveProperty('createdAt', expect.any(Date));
      expect(newUser).toHaveProperty('updatedAt', expect.any(Date));
    });

    it('should throw an error if email is invalid', async () => {
      const invalidEmailUser = {
        userName:testUser.userName,
        email: 'invalidemail',
        password: testUser.password,
      }
      await expect(createUser(invalidEmailUser)).rejects.toThrow('Error creating user: ValidationError: email: Invalid email');
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const newUser = await createUser(testUser);
      const userByEmail = await getUserByEmail(testUser.email);

      expect(userByEmail).toHaveProperty('_id', newUser._id);
      expect(userByEmail).toHaveProperty('userName', testUser.userName);
      expect(userByEmail).toHaveProperty('password', expect.any(String));
      expect(testUser.password).not.toEqual(userByEmail?.password);
      expect(userByEmail).toHaveProperty('email', testUser.email);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';
      const user = await getUserByEmail(email);

      expect(user).toBeNull();
    });
  });

  describe('getUserByUserName', () => {
    it('should return a user by username', async () => {
  
      const newUser = await createUser(testUser);
      const userByUserName = await getUserByUserName(testUser.userName);
      expect(userByUserName).toHaveProperty('_id', newUser._id);
      expect(userByUserName).toHaveProperty('userName', testUser.userName);
      expect(userByUserName).toHaveProperty('email', testUser.email);
    });

    it('should return null if user is not found', async () => {
      const userName = 'nonexistent';
      const user = await getUserByUserName(userName);

      expect(user).toBeNull();
    });
  })
  describe('comparePassword', () => {
    it('should return true if password is correct', async () => {
      const newUser = await createUser(testUser);
      expect(newUser.password).not.toEqual(testUser.password);
      expect(bcrypt.compareSync(testUser.password, newUser.password)).toBe(true);
    });
    it('should return false if password is incorrect', async () => {
      const newUser = await createUser(testUser);
      expect(bcrypt.compareSync('wrongpassword', newUser.password)).toBe(false);
    })
  })
  
  
});