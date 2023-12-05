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
  const dir = path.join(__dirname, '../../app');
  const files = getComponentFiles(dir);

  const importStatements = files.map(filePath => 
  {
    const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
    return `@import '${relativePath.substring(3)}';`; //remove the extra ../
  });

  const output = importStatements.join('\n');
  fs.writeFileSync(path.join(__dirname, '../../css/_imports.scss'), output, 'utf-8');
  console.log('sass files successfully imported')
}

generateImportStatements();