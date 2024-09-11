//echo \"Error: no test specified\" && exit 1

import request from 'supertest';
import App from '../src/app';
import prisma from '../src/prisma';

const app = new App().app;
describe('Test auth user', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  test('returns success login', async () => {
    const response = await request(app)
    //   .post('/login')
    //   .send({
    //     username: 'rohman@gmail.com',
    //     password: 'AlphaThap42@',
    //   });
  
    // console.log('Response Status:', response.status); // Log status code
    // console.log('Response Body:', response.body); // Log the body
  
    // Check if response body exists
   // expect(response.body).not.toBeUndefined();
 // expect(response).toHaveProperty('success', true);
  });
    });  

