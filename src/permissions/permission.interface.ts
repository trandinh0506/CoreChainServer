

export interface IPermission {
  _id: string;
  name: string;
  apiPath: string;
  method: string;
  module: string;
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
