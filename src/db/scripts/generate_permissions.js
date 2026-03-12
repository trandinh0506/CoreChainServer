const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcDir = path.join(__dirname, 'src');

function findControllers(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findControllers(filePath, fileList);
    } else if (file.endsWith('.controller.ts')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const controllerFiles = findControllers(srcDir);

let sqlStatements = [];

for (const filePath of controllerFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  let currentControllerRoute = '';
  const moduleName = path.basename(filePath).split('.')[0].toUpperCase();
  
  const controllerMatch = content.match(/@Controller\((?:['"]([^'"]+)['"])?\)/);
  if (controllerMatch) {
    currentControllerRoute = controllerMatch[1] || '';
  }

  const methodRegex = /@(Get|Post|Patch|Put|Delete)\((?:['"]([^'"]*)['"])?\)/g;
  
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const httpMethod = match[1].toUpperCase();
    let subRoute = match[2] || '';
    
    if (subRoute.startsWith('/')) subRoute = subRoute.substring(1);
    
    let apiPath = `/${currentControllerRoute}`;
    if (subRoute) {
      if (!apiPath.endsWith('/')) {
         apiPath += `/${subRoute}`;
      } else {
         apiPath += subRoute;
      }
    }
    
    apiPath = apiPath.replace(/\/\//g, '/');

    let actionName = '';
    if (httpMethod === 'POST') actionName = `Create ${moduleName.toLowerCase()}`;
    else if (httpMethod === 'GET' && apiPath.includes(':id')) actionName = `Get ${moduleName.toLowerCase()} by ID`;
    else if (httpMethod === 'GET') actionName = `Get all ${moduleName.toLowerCase()}`;
    else if (httpMethod === 'PATCH' || httpMethod === 'PUT') actionName = `Update ${moduleName.toLowerCase()}`;
    else if (httpMethod === 'DELETE') actionName = `Delete ${moduleName.toLowerCase()}`;

    const id = crypto.randomUUID();
    const isDeleted = 0;
    
    // Using current timestamp for createdAt and updatedAt
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `INSERT INTO \`permissions\` (\`_id\`, \`name\`, \`apiPath\`, \`method\`, \`module\`, \`isDeleted\`, \`createdAt\`, \`updatedAt\`) VALUES ('${id}', '${actionName.trim()}', '${apiPath}', '${httpMethod}', '${moduleName}', ${isDeleted}, '${now}', '${now}');`;
    sqlStatements.push(sql);
  }
}

const outputSqlPath = path.join(__dirname, 'permissions_seed.sql');
fs.writeFileSync(outputSqlPath, sqlStatements.join('\n'));
console.log(`Generated ${sqlStatements.length} permission queries in ${outputSqlPath}`);
