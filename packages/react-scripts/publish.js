'use strict';

const execSync = require('child_process').execSync;
const fs = require('fs');
const readline = require('readline');
const allTheThingsPackageJson = require('./package.json');
const craTemplatePackageJson = require('../cra-template/package.json');
const craTemplateTypescriptPackageJson = require('../cra-template-typescript/package.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const execOptions = { stdio: 'inherit' };

console.log(`Current package version: ${allTheThingsPackageJson.version}`);

rl.question('New version: ', answer => {
  rl.close();

  savePackageJson(answer);
  pushToGitRepo(answer);
  publishToNpm(answer);
});

function savePackageJson(version) {
  console.log('Saving to package.json...');
  allTheThingsPackageJson.version = version;
  craTemplatePackageJson.version = version;
  craTemplateTypescriptPackageJson.version = version;
  fs.writeFileSync(
    'package.json',
    JSON.stringify(allTheThingsPackageJson, null, 2)
  );
  fs.writeFileSync(
    '../cra-template/package.json',
    JSON.stringify(craTemplatePackageJson, null, 2)
  );
  fs.writeFileSync(
    '../cra-template-typescript/package.json',
    JSON.stringify(craTemplateTypescriptPackageJson, null, 2)
  );
  execSync('npm install --package-lock-only', execOptions);
}

function pushToGitRepo(version) {
  console.log('Pushing git repo...');
  execSync(`git commit -am "Publish version: ${version}"`, execOptions);
  execSync('git push', execOptions);
}

function publishToNpm(version) {
  console.log('Publishing to npm...');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('OTP: ', code => {
    rl.close();
    execSync(`cd ../cra-template && npm publish --otp=${code}`, execOptions);
    execSync(
      `cd ../cra-template-typescript && npm publish --otp=${code}`,
      execOptions
    );
    execSync(`npm publish --otp=${code}`, execOptions);

    updateExampleRepo(version);
    updateHelloworldRepo(version);
  });
}

function updateExampleRepo(version) {
  console.log('Updating example repo...');
  const cdCmd = 'cd ~/Sites/';

  console.log('Moving .git directory to a safe place...');
  execSync(`${cdCmd}; mv all-the-things-example/.git .`, execOptions);

  console.log('Removing old repo...');
  execSync(`${cdCmd}; rm -rf all-the-things-example`, execOptions);
  execSync(`${cdCmd}; mkdir all-the-things-example`, execOptions);

  console.log('Moving .git directory back into place...');
  execSync(`${cdCmd}; mv .git all-the-things-example`, execOptions);

  console.log('Installing new repo via npx...');
  execSync(
    `${cdCmd}; npx create-react-app all-the-things-example --use-npm --scripts-version=cra-all-the-things --template=all-the-things`,
    execOptions
  );

  console.log('Creating commit...');
  const cdExampleCmd = 'cd ~/Sites/all-the-things-example';
  execSync(`${cdExampleCmd}; git add -A`, execOptions);
  execSync(
    `${cdExampleCmd}; git commit -am "Publish version: ${version}"`,
    execOptions
  );
  execSync(`${cdExampleCmd}; git push`, execOptions);
}

function updateHelloworldRepo(version) {
  console.log('Updating helloworld repo...');

  const packageJsonPath = '/Users/mime/Sites/helloworld/package.json';
  const helloworldPackageJson = require(packageJsonPath);
  helloworldPackageJson['dependencies']['cra-all-the-things'] = version;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(helloworldPackageJson, null, 2)
  );

  const cdCmd = 'cd ~/Sites/helloworld';
  execSync(`${cdCmd}; npm update cra-all-the-things`, execOptions);
  execSync(`${cdCmd}; npm install`, execOptions);
  execSync(`${cdCmd}; git add -A`, execOptions);

  console.log('Finished!');
}
