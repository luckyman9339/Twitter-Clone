import request from 'supertest';
import appStarter from '../app';
import knex from '../db/knex';

let app = null;

describe('auth', () => {
  beforeAll(async () => {
    app = await appStarter.start();
  });

  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run());
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  afterAll(() => {
    return knex.destroy();
  });

  it('should login with correct credentials', done => {
    request(app)
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'test',
      })
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.status).toBe(200);
        done();
      });
  });

  it('should not login with incorrect credentials', done => {
    request(app)
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: 'incorrect_password',
      })
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.status).toBe(401);
        done();
      });
  });

  it('should not login without credentials', done => {
    request(app)
      .post('/auth/login')
      .send({
        username: 'test_user',
        password: '',
      })
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.status).toBe(400);
        done();
      });
  });

  it('should not login with an invalid username', done => {
    request(app)
      .post('/auth/login')
      .send({
        username: 'username_not_valid',
        password: '',
      })
      .end((err, res) => {
        expect(err).toBeNull();
        expect(res.status).toBe(400);
        done();
      });
  });
});
