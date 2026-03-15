import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Contract, Gateway, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as grpc from '@grpc/grpc-js';

const mspId = 'HrMSP';
const channelName = 'hrmchannel';
const chaincodeName = 'employeecontract';

// Path to crypto materials
const cryptoPath = path.resolve(__dirname, '..', '..', 'fabric-network', 'organizations', 'peerOrganizations', 'hr.com');
const certDirPath = path.resolve(cryptoPath, 'users', 'Admin@hr.com', 'msp', 'signcerts');
const keyDirPath = path.resolve(cryptoPath, 'users', 'Admin@hr.com', 'msp', 'keystore');
const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.hr.com', 'tls', 'ca.crt');

const peerEndpoint = 'localhost:7051';
const peerHostAlias = 'peer0.hr.com';

@Injectable()
export class FabricService implements OnModuleInit, OnModuleDestroy {
  private gateway: Gateway;
  private client: grpc.Client;
  private contract: Contract;

  async onModuleInit() {
    await this.initGateway();
  }

  async onModuleDestroy() {
    if (this.gateway) {
      this.gateway.close();
    }
    if (this.client) {
      this.client.close();
    }
  }

  private async initGateway(): Promise<void> {
    const tlsRootCert = await fs.readFile(tlsCertPath);
    this.client = new grpc.Client(peerEndpoint, grpc.credentials.createSsl(tlsRootCert), {
        'grpc.ssl_target_name_override': peerHostAlias,
    });

    this.gateway = connect({
        client: this.client,
        identity: await this.newIdentity(),
        signer: await this.newSigner(),
    });

    const network = this.gateway.getNetwork(channelName);
    this.contract = network.getContract(chaincodeName);
  }

  private async newIdentity(): Promise<Identity> {
      const certPath = await this.getFirstDirFileName(certDirPath);
      const credentials = await fs.readFile(certPath);
      return { mspId, credentials };
  }

  private async newSigner(): Promise<Signer> {
      const keyPath = await this.getFirstDirFileName(keyDirPath);
      const privateKeyPem = await fs.readFile(keyPath);
      const privateKey = crypto.createPrivateKey(privateKeyPem);
      return signers.newPrivateKeySigner(privateKey);
  }

  private async getFirstDirFileName(dirPath: string): Promise<string> {
      const files = await fs.readdir(dirPath);
      if (files.length === 0) {
          throw new Error(`Directory is empty: ${dirPath}`);
      }
      return path.join(dirPath, files[0]);
  }

  // --- Contract Methods ---

  public async getEmployee(id: string): Promise<any> {
      const resultBytes = await this.contract.evaluateTransaction('readEmployee', id);
      const resultJson = Buffer.from(resultBytes).toString('utf8');
      return JSON.parse(resultJson);
  }

  public async createEmployee(id: string, name: string, position: string, salary: number, departmentId: string): Promise<void> {
      await this.contract.submitTransaction(
          'createEmployee',
          id,
          name,
          position,
          salary.toString(),
          departmentId
      );
  }

  public async updateSalary(id: string, newSalary: number): Promise<void> {
      await this.contract.submitTransaction(
          'updateSalary',
          id,
          newSalary.toString()
      );
  }

  public async getAllEmployees(): Promise<any[]> {
      const resultBytes = await this.contract.evaluateTransaction('getAllEmployees');
      const resultJson = Buffer.from(resultBytes).toString('utf8');
      return JSON.parse(resultJson);
  }
}
