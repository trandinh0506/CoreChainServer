export interface IContract {
  _id: string;
  contractCode: string;
  type: string;
  file: string;
  startDate: Date;
  endDate: Date;
  status: string;
  employee:
    | string
    | {
        name: string;
        email: string;
      };
  salary: number;
  allowances: number;
  insurance: string;
  workingHours: number;
  leavePolicy: string;
  terminationTerms: string;
  confidentialityClause: string;
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
