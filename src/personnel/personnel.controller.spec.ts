import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelController } from './personnel.controller';
import { PersonnelService } from './personnel.service';

describe('PersonnelController', () => {
  let controller: PersonnelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonnelController],
      providers: [PersonnelService],
    }).compile();

    controller = module.get<PersonnelController>(PersonnelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
