import mongoose from 'mongoose';

export interface EmployeeBlockchainData {
  employeeId: string;
  encryptedData: string;
  timestamp?: number;
  isActive?: boolean;
}
