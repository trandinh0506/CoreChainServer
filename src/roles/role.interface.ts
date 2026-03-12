

export interface IRole {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  permissions: Array<string>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: Boolean;
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
