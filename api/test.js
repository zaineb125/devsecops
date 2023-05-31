const request = require('supertest');

var app ;

describe('API tests', () => {
    beforeEach(async () => {
         app = await require('./server'); 
      });

  test('test login should return a valid token', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('test login should contain email', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      });
    
    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe('test@example.com');
  });

  afterEach((done) => {
    delete require.cache[require.resolve( './server' )]
    done()
  });
});


