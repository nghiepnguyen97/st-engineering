import request from 'supertest';
import * as fs from 'fs';
import MExpress from '../../modules/express';

describe('FILE', () => {
    let express: MExpress;

    beforeAll(async () => {
        express = MExpress.getInstance();
    })

    describe('UPLOAD', () => {
        describe('Success upload file', () => {
            test('/file/upload', async () => {
                const fileBuffer = fs.readFileSync('./file-uploads-test/data.csv');
                const res = await request(express.app)
                    .post('/file/upload')
                    .set('Content-Type', 'multipart/form-data')
                    .field('name', 'file')
                    .attach('file', fileBuffer, {
                        filename: 'data.csv',
                    });
                expect(res.statusCode).toBe(200);
                expect(res.body.error).toEqual(false);
                expect(res.body.data).toEqual(true);
            });
        });

        describe('Success get not empty list with search postId is equal 1', () => {
            test('/file/items', async () => {
                const res = await request(express.app).get('/file/items?filters={"properties":{"search":{"column":"postId","data":"1"}},"page":1}');
                expect(res.statusCode).toBe(200);
                expect(res.body.data.pages).toEqual(5);
                expect(res.body.data.current).toEqual(1);
                expect(res.body.data.total).toEqual(100);
                expect(res.body.data.data.length).toEqual(20);
            });
        });
    })

    describe('GET LIST', () => {
        describe('Success get empty list', () => {
            test('/file/items', async () => {
                const res = await request(express.app).get('/file/items?filters={"properties":{"search":{"column":"postId","data":"test"}},"page":1}');
                expect(res.statusCode).toBe(200);
                expect(res.body.data.pages).toEqual(0);
                expect(res.body.data.current).toEqual(1);
                expect(res.body.data.total).toEqual(0);
                expect(res.body.data.data.length).toEqual(0);
            });
        });

        describe('Success get not empty list with search postId is equal 1', () => {
            test('/file/items', async () => {
                const res = await request(express.app).get('/file/items?filters={"properties":{"search":{"column":"postId","data":"1"}},"page":1}');
                expect(res.statusCode).toBe(200);
                expect(res.body.data.pages).toEqual(5);
                expect(res.body.data.current).toEqual(1);
                expect(res.body.data.total).toEqual(100);
                expect(res.body.data.data.length).toEqual(20);
            });
        });
    })
})