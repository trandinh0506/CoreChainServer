export interface IDepartment {
  _id: string;
  name: string;
  code: string;
  description: string;
  manager: string;
  employees: Array<string>;
  status: string;
  budget: number;
  projectIds: Array<string>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
  deletedBy: {
    _id: string;
    email: string;
  };
}
