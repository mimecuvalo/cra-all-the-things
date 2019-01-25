const execSync = require('child_process').execSync;
const fs = require('fs');
const readline = require('readline');
const package = require('./package.json');
const util = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fsWrite = util.promisify(fs.writeFile);

console.log(`Current package version: ${package.version}`);

rl.question('New version: ', answer => {
  rl.close();

  savePackageJson(answer);
  pushToGitRepo(answer);
  publishToNpm();
  updateExampleRepo();
  updateHelloworldRepo();
});

function savePackageJson(version) {
  console.log('Saving to package.json...');
  package.version = version;
  fs.writeFileSync('package.json', JSON.stringify(package, null, 2));
}

function pushToGitRepo(version) {
  console.log('Pushing git repo...');
  execSync('git add -A');
  execSync(`git commit -m "Publish version: ${version}"`);
  execSync('git push');
}

function publishToNpm() {
  console.log('Publishing to npm...');
  execSync('npm publish');
}

function updateExampleRepo() {
  console.log('Updating example repo...');
  execSync('cd ~/Dropbox/Sites/');
  execSync('mv all-the-things-example/.git .');
  execSync('rm -rf all-the-things-example');
  execSync('npx create-react-app all-the-things-example --use-npm --scripts-version=cra-all-the-things');
  execSync('mv .git all-the-things-example');
  execSync('git add -A');
}

function updateHelloworldRepo() {
  console.log('Updating helloworld repo...');
  execSync('cd ~/Dropbox/Sites/helloworld');
  execSync('npm update cra-all-the-things');
  execSync('git add -A');
}
