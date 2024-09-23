import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Driver Controller', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/drivers', () => {
    beforeEach(async () => {
      await testService.deleteDriver();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/drivers')
        .send({
          name: '',
          phone_number: '',
          email: '',
          password: '',
          country: '',
          ktp: '',
          address_ktp: '',
          ktp_img: '',
          vehicle_type: '',
          sim: '',
          sim_img: '',
          selfie_with_sim: '',
          vehicle_brand: '',
          vehicle_color: '',
          license_plate: '',
          registration_number: '',
          profile_img: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    // it('should be able to register', async () => {
    //   await testService.deleteDriver();
    //   const response = await request(app.getHttpServer())
    //     .post('/api/drivers')
    //     .send({
    //       name: 'test',
    //       phone_number: 'test',
    //       email: 'test',
    //       password: 'test',
    //       country: 'test',
    //       ktp: 'test',
    //       address_ktp: 'test',
    //       ktp_img: 'test',
    //       vehicle_type: 'MOTOR',
    //       sim: 'test',
    //       sim_img: 'test',
    //       selfie_with_sim: 'test',
    //       vehicle_brand: 'test',
    //       vehicle_color: 'test',
    //       license_plate: 'test',
    //       registration_number: 'test',
    //       profile_img: 'test',
    //     });

    //   logger.info(response.body);

    //   expect(response.status).toBe(200);
    //   expect(response.body.data.name).toBe('test');
    //   expect(response.body.data.email).toBe('test');
    //   expect(response.body.data.phone_number).toBe('test');
    //   expect(response.body.data.ktp).toBe('test');
    //   expect(response.body.data.sim).toBe('test');
    //   expect(response.body.data.registration_number).toBe('test');
    // });

    it('should be rejected if ktp already exist', async () => {
      await testService.deleteDriver();
      await testService.createDriver();
      const response = await request(app.getHttpServer())
        .post('/api/drivers')
        .send({
          name: 'test',
          phone_number: 'test',
          email: 'test',
          password: 'test',
          country: 'test',
          ktp: 'test',
          address_ktp: 'test',
          ktp_img: 'test',
          vehicle_type: 'test',
          sim: 'test',
          sim_img: 'test',
          selfie_with_sim: 'test',
          vehicle_brand: 'test',
          vehicle_color: 'test',
          license_plate: 'test',
          registration_number: 'test',
          profile_img: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
