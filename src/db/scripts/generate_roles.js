const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const permissionsSeedPath = path.join(__dirname, 'permissions_seed.sql');
const content = fs.readFileSync(permissionsSeedPath, 'utf-8');

const permissions = [];
// Parse standard INSERT INTO `permissions` statements to extract _id and module
const regex = /VALUES \('([^']+)', '[^']+', '[^']+', '[^']+', '([^']+)'/g;
let match;
while ((match = regex.exec(content)) !== null) {
  permissions.push({
    id: match[1],
    module: match[2]
  });
}

const roles = [
  { id: crypto.randomUUID(), name: 'Super Admin', description: 'Has all permissions' },
  { id: crypto.randomUUID(), name: 'HR Admin', description: 'Personnel and salary, report management' },
  { id: crypto.randomUUID(), name: 'Manager', description: 'Team, approval, project, task management' },
  { id: crypto.randomUUID(), name: 'Employee', description: 'Usual permissions' }
];

const rolePermissions = [];

const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

// Map permissions
roles.forEach(role => {
  permissions.forEach(permission => {
    let grant = false;

    if (role.name === 'Super Admin') {
      grant = true;
    } else if (role.name === 'HR Admin') {
      if (['PERSONNEL', 'REPORTS', 'USERS', 'DEPARTMENTS', 'POSITIONS'].includes(permission.module)) {
        grant = true;
      }
    } else if (role.name === 'Manager') {
      if (['PROJECTS', 'TASKS', 'USERS', 'DEPARTMENTS', 'POSITIONS', 'REPORTS'].includes(permission.module)) {
        grant = true;
      }
    } else if (role.name === 'Employee') {
      // Basic access for employee, typically GET requests or specific modules like Auth, User Profile, Tasks to view
      if (['AUTH', 'APP', 'FILES', 'FEEDBACK'].includes(permission.module)) {
          grant = true;
      }
    }

    if (grant) {
        rolePermissions.push({
            roleId: role.id,
            permissionId: permission.id
        });
    }
  });
});

let sqlStatements = [];
sqlStatements.push('-- Roles Data');

roles.forEach(role => {
  sqlStatements.push(`INSERT INTO \`roles\` (\`_id\`, \`name\`, \`description\`, \`isActive\`, \`isDeleted\`, \`createdAt\`, \`updatedAt\`) VALUES ('${role.id}', '${role.name}', '${role.description}', 1, 0, '${now}', '${now}');`);
});

sqlStatements.push('\n-- Role-Permissions Relation Data');

rolePermissions.forEach(rp => {
  sqlStatements.push(`INSERT INTO \`roles_permissions_permissions\` (\`rolesId\`, \`permissionsId\`) VALUES ('${rp.roleId}', '${rp.permissionId}');`);
});

const outputSqlPath = path.join(__dirname, 'roles_seed.sql');
fs.writeFileSync(outputSqlPath, sqlStatements.join('\n'));
console.log(`Generated ${roles.length} roles and ${rolePermissions.length} permission mappings in ${outputSqlPath}`);
