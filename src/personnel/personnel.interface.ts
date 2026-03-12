export interface ISalaryAdvance {
  _id: string;
  employee: string;
  amount: number;
  reason: string;
  isApproved: boolean;
  approvedBy: {
    _id: string;
    email: string;
  } | string;
  returnDate: Date;
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
