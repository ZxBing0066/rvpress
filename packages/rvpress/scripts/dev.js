const chokidar = require('chokidar');
const childProcess = require('child_process');
const fs = require('fs-extra');

function toDest(file) {
    return file.replace(/^src\//, 'dist/');
}

const projects = ['client', 'theme-default'];

projects.forEach(project => {
    chokidar
        .watch(`src/${project}`, {
            ignored: ['**/tsconfig.json', '**/*.(ts|tsx)']
        })
        .on('all', (event, path) => {
            if (event === 'change' || event === 'add') {
                fs.copySync(path, toDest(path));
            }
        });

    childProcess.spawn(`pnpx tsc -p src/${project} -w`, { shell: true, stdio: 'inherit' });
});

childProcess.spawn(`pnpx rollup -c scripts/rollup.config.js -w`, { shell: true, stdio: 'inherit' });
childProcess.spawn(`pnpx tsc -p src/node -w`, { shell: true, stdio: 'inherit' });
