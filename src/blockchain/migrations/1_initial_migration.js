// migrations/1_deploy_contracts.js
const EmployeeRegistry = artifacts.require('EmployeeRegistry');

module.exports = function (deployer) {
  deployer.deploy(EmployeeRegistry);
};
