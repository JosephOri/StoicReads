import crypto from 'crypto';

const BYTE_SIZE = 4;
const MAX_32BIT_INT = 0xffffffff;
const RADIX = 16;

const getRandomNumber = (min: number, max: number) => {
  const bytes = crypto.randomBytes(BYTE_SIZE);
  const randomNumber = parseInt(bytes.toString('hex'), RADIX);
  return Math.floor(randomNumber / (MAX_32BIT_INT / (max - min + 1))) + min;
};

export default getRandomNumber;
