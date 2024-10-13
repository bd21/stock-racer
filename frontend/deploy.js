const ghpages = require('gh-pages');
const path = require('path');

const options = {
  branch: 'gh-pages',
  repo: 'https://github.com/bd21/stock-racer.git', // Update this to your repo URL
  dotfiles: true,
  silent: false,
  // Add these options to handle large repositories
  depth: 1,
  add: true
};

const deployDirectory = path.join(__dirname, 'build');

ghpages.publish(deployDirectory, options, function(err) {
  if (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  } else {
    console.log('Deployment successful!');
    console.log('Files published:');
    ghpages.ls(options.branch, options, (err, files) => {
      if (err) {
        console.error('Error listing files:', err);
      } else {
        console.log(files);
      }
    });
  }
});
