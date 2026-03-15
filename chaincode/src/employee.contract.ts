import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

export class Employee {
    public id!: string;
    public name!: string;
    public position!: string;
    public salary!: number;
    public departmentId!: string;
    public docType?: string;
}

@Info({ title: 'EmployeeSalaryContract', description: 'Smart contract for managing employee salaries' })
export class EmployeeSalaryContract extends Contract {

    @Transaction()
    public async initLedger(ctx: Context): Promise<void> {
        const employees: Employee[] = [
            {
                id: 'emp1',
                name: 'Alice Smith',
                position: 'Developer',
                salary: 5000,
                departmentId: 'dept1',
            },
        ];

        for (const employee of employees) {
            employee.docType = 'employee';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, we take care of parsing it back to JSON
            await ctx.stub.putState(employee.id, Buffer.from(stringify(sortKeysRecursive(employee))));
            console.info(`Employee ${employee.id} initialized`);
        }
    }

    @Transaction()
    public async createEmployee(ctx: Context, id: string, name: string, position: string, salary: number, departmentId: string): Promise<void> {
        const exists = await this.employeeExists(ctx, id);
        if (exists) {
            throw new Error(`The employee ${id} already exists`);
        }

        const employee: any = {
            id,
            name,
            position,
            salary,
            departmentId,
            docType: 'employee'
        };

        // Ensure only HR or authorized org can create, here we don't strict it yet, but can be added via ctx.clientIdentity
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'HrMSP') {
            throw new Error('Only HrMSP is allowed to create employees');
        }

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(employee))));
    }

    @Transaction(false)
    public async readEmployee(ctx: Context, id: string): Promise<string> {
        const employeeJSON = await ctx.stub.getState(id);
        if (!employeeJSON || employeeJSON.length === 0) {
            throw new Error(`The employee ${id} does not exist`);
        }
        return employeeJSON.toString();
    }

    @Transaction()
    public async updateSalary(ctx: Context, id: string, newSalary: number): Promise<void> {
        const exists = await this.employeeExists(ctx, id);
        if (!exists) {
            throw new Error(`The employee ${id} does not exist`);
        }

        // Only HrMSP can update salary
        const mspID = ctx.clientIdentity.getMSPID();
        if (mspID !== 'HrMSP') {
            throw new Error('Only HrMSP is allowed to update employee salaries');
        }

        const employeeString = await this.readEmployee(ctx, id);
        const employee = JSON.parse(employeeString) as Employee;
        
        employee.salary = newSalary;
        
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(employee))));
    }

    @Transaction(false)
    public async employeeExists(ctx: Context, id: string): Promise<boolean> {
        const employeeJSON = await ctx.stub.getState(id);
        return employeeJSON && employeeJSON.length > 0;
    }

    @Transaction(false)
    @Returns('string')
    public async getAllEmployees(ctx: Context): Promise<string> {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (record.docType === 'employee') {
                 allResults.push(record);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}
