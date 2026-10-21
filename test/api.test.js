import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import { bearer, useDatabase } from './helpers.js';


const base = '/api/favorites';

describe('favorites service', () => {
  useDatabase();

  it('requires a token', async () => {
    await request(app).get(base).expect(401);
  });

  it('returns 404 for an unknown user', async () => {
    await request(app).get(base).set(bearer()).expect(404);
    await request(app).post(`${base}/add`).set(bearer()).send({ productId: 'x' }).expect(404);
  });

  it('adds a product once, lists it and removes it', async () => {
    const user = await User.create({ name: 'Dan', email: 'dan@example.com', password: 'long-enough-1' });
    const product = await Product.create({ name: 'Cap', price: 15 });
    const productId = product.id;

    await request(app).post(`${base}/add`).set(bearer(user.id)).send({ productId }).expect(200);
    const again = await request(app).post(`${base}/add`).set(bearer(user.id)).send({ productId }).expect(200);
    assert.equal(again.body.length, 1);

    const list = await request(app).get(base).set(bearer(user.id)).expect(200);
    assert.equal(list.body[0].name, 'Cap');

    const removed = await request(app).delete(`${base}/remove`).set(bearer(user.id)).send({ productId }).expect(200);
    assert.equal(removed.body.length, 0);
  });

  it('hashes the password when a user is saved', async () => {
    const user = await User.create({ name: 'Eve', email: 'eve@example.com', password: 'plain-text-pw' });
    assert.notEqual(user.password, 'plain-text-pw');
    assert.ok(await user.matchPassword('plain-text-pw'));
  });
});
