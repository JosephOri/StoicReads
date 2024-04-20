// import axios from 'axios';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const options = {
  method: 'GET',
  url: 'https://tripadvisor16.p.rapidapi.com/api/v1/restaurant/getRestaurantDetails',
  params: {
    restaurantsId: 'Restaurant_Review-g304554-d8010527-Reviews-Saptami-Mumbai_Maharashtra',
    currencyCode: 'USD'
  },
  headers: {
    'X-RapidAPI-Key': 'f8662f8ed1msh343418130ebdb98p11bf57jsna9bf16098028',
    'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
  }
};

(async () => {
  try {
    const response = await axios.request(options);
    const filePath = path.join(__dirname, 'reviews.json');  
    await fs.writeFile(filePath, JSON.stringify(response.data, null, 2));
    console.log('File written successfully');
  } catch (error) {
    console.error(error);
  }
})();
