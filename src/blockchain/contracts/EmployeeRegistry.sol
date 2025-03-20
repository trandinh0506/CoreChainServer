// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmployeeRegistry {
    struct Employee {
        string employeeId;
        string encryptedData;
        uint256 timestamp;
        bool isActive;
    }
    
    mapping(string => Employee) private employees;
    string[] private employeeIds;
    address private owner;
    
    event EmployeeAdded(string employeeId, uint256 timestamp);
    event EmployeeUpdated(string employeeId, uint256 timestamp);
    event EmployeeDeactivated(string employeeId, uint256 timestamp);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    function addEmployee(string memory _employeeId, string memory _encryptedData) public onlyOwner {
        require(bytes(employees[_employeeId].employeeId).length == 0, "Employee already exists");
        
        employees[_employeeId] = Employee({
            employeeId: _employeeId,
            encryptedData: _encryptedData,
            timestamp: block.timestamp,
            isActive: true
        });
        
        employeeIds.push(_employeeId);
        emit EmployeeAdded(_employeeId, block.timestamp);
    }
    
    function updateEmployee(string memory _employeeId, string memory _encryptedData) public onlyOwner {
        require(bytes(employees[_employeeId].employeeId).length > 0, "Employee does not exist");
        require(employees[_employeeId].isActive, "Employee is not active");
        
        employees[_employeeId].encryptedData = _encryptedData;
        employees[_employeeId].timestamp = block.timestamp;
        
        emit EmployeeUpdated(_employeeId, block.timestamp);
    }
    
    function deactivateEmployee(string memory _employeeId) public onlyOwner {
        require(bytes(employees[_employeeId].employeeId).length > 0, "Employee does not exist");
        require(employees[_employeeId].isActive, "Employee already inactive");
        
        employees[_employeeId].isActive = false;
        employees[_employeeId].timestamp = block.timestamp;
        
        emit EmployeeDeactivated(_employeeId, block.timestamp);
    }
    
    function getEmployee(string memory _employeeId) public view returns (string memory, string memory, uint256, bool) {
        Employee memory employee = employees[_employeeId];
        require(bytes(employee.employeeId).length > 0, "Employee does not exist");
        
        return (
            employee.employeeId,
            employee.encryptedData,
            employee.timestamp,
            employee.isActive
        );
    }
    
    function getAllEmployeeIds() public view returns (string[] memory) {
        return employeeIds;
    }
}