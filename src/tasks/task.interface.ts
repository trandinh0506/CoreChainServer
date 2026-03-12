

export interface ITask {
  _id: string;
  title: string;
  description: string;
  attachments: Array<string>;
  createdBy: {
    _id: string;
    email: string;
  };
  assignedTo: string;
  projectId: string;
  priority: number;
  status: number;
  startDate: Date;
  dueDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  updatedBy: {
    _id: string;
    email: string;
  };
  deletedBy: {
    _id: string;
    email: string;
  };
}
