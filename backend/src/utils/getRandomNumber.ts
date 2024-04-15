import crypto from 'crypto';

const getRandomNumber = (min: number, max: number) => {
  const bytes = crypto.randomBytes(4);
  const randomNumber = parseInt(bytes.toString('hex'), 16);
  return Math.floor(randomNumber / (0xffffffff / (max - min + 1))) + min;
};

export default getRandomNumber;
