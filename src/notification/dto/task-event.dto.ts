export class UserInfoDto {
  _id: string;
  email: string;
  name?: string;
  fcmToken?: string;
}

export class TaskDataDto {
  _id: string;
  title: string;
  description: string;
  attachments: string[];
  createdBy: {
    _id: string;
    email: string;
  };
  assignedTo: string;
  projectId: string;
  priority: number;
  status: number;
  startDate?: Date;
  dueDate?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  updatedBy?: {
    _id: string;
    email: string;
  };
  deletedBy?: {
    _id: string;
    email: string;
  };
}

export class AssignedUserMetadataDto {
  _id: string;
  fcmToken: string;
  name: string;
  email: string;
}

export class TaskCreatedEventDto {
  event_type: string;
  timestamp: string;
  data: TaskDataDto;
  metadata: {
    assignedToUser: AssignedUserMetadataDto;
  };
}
