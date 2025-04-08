import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { getModelToken } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { TasksService } from 'src/tasks/tasks.service';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    }),
    findOne: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockTasksService = {
    countTask: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        ProjectsService,
        {
          provide: getModelToken(Project.name),
          useValue: mockProjectModel,
        },
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const createProjectDto = {
        name: 'Test Project',
        description: 'Test Description',
        department: 'department-id',
        revenue: 1000,
        priority: 1,
        status: 1,
        startDate: new Date(),
        endDate: new Date(),
      };

      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
      };

      const mockCreatedProject = {
        _id: 'project-id',
        ...createProjectDto,
      };

      mockProjectModel.create.mockResolvedValueOnce(mockCreatedProject);

      const result = await controller.create(
        createProjectDto as any,
        mockUser as any,
      );
      expect(result).toBe(mockCreatedProject._id);
    });
  });

  describe('findAll', () => {
    it('should return paginated projects', async () => {
      const mockProjects = [
        { _id: '1', name: 'Project 1' },
        { _id: '2', name: 'Project 2' },
      ];

      mockProjectModel.find().exec.mockResolvedValueOnce(mockProjects);

      const result = await controller.findAll('1', '10', '');
      expect(result).toBeDefined();
    });
  });
});
