import * as request from 'supertest';
import { config } from 'dotenv';
import { ok } from './ok';
import 'should';
import { DAuthenticatedUser } from '../src/modules/user/user.dto';

declare let server, seed: { users: DAuthenticatedUser[] };

const user1 = {
  email: 'example@example.com',
  password: 'pass1234',
  name: 'Nick Testing',
};

describe('user', async () => {
  let res, newUser;

  it(`should be able to register`, async () => {
    res = await request(server)
    .post('/api/v1/register')
    .send(user1);
    ok(res);
    newUser = res.body.data;
    console.log(newUser);
    newUser.should.have.properties('id', 'name', 'email', 'token');
    newUser.name.should.equal(user1.name);
    newUser.email.should.equal(user1.email);
  });

  it('should not be able to get info if not verified', async () => {
    res = await request(server)
    .get('/api/v1/user')
    .set('Authorization', newUser.token)
    .expect(400);
  });

  it('should be able to get info for a verified user', async () => {
    res = await request(server)
    .get('/api/v1/user')
    .set('Authorization', seed.users[0].token);
    ok(res);
  });

  it('should be able to login', async () => {
    res = await request(server)
    .post('/api/v1/login')
    .send({ email: seed.users[0].email, password: 'password' });
    ok(res);
  });

  it('should be able to login even if garbage auth token is sent', async () => {
    res = await request(server)
    .post('/api/v1/login')
    .send({ email: seed.users[0].email, password: 'password' })
    .set('Authorization', 'garbage');
    ok(res);
  });

});
