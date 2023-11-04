const fs = require('fs');
const path = require('path');

function getComponentFiles(dirPath, fileExt = '.scss') 
{
  const files = fs.readdirSync(dirPath);

  return files.reduce((acc, file) => 
  {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory())
    {
      const nestedFiles = getComponentFiles(filePath, fileExt);
      return [...acc, ...nestedFiles];
    }

    if (path.extname(filePath) === fileExt) 
      return [...acc, filePath];

    return acc;
  }, []);
}

function generateImportStatements() 
{
  const componentsDir = path.join(__dirname, '../app/components');
  const routesDir = path.join(__dirname, '../app/(routes)');
  const componentFiles = getComponentFiles(componentsDir);
  const routesFiles = getComponentFiles(routesDir);
  const allFiles = componentFiles.concat(routesFiles);

  const importStatements = allFiles.map(filePath => 
  {
    const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
    return `@import '${relativePath}';`;
  });

  const output = importStatements.join('\n');
  fs.writeFileSync(path.join(__dirname, '../css/_imports.scss'), output, 'utf-8');

  console.log('sass files successfully imported')
}

generateImportStatements();