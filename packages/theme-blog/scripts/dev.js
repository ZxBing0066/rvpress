const chokidar = require('chokidar');
const childProcess = require('child_process');
const fs = require('fs-extra');

function toDest(file) {
    return file.replace(/^src\//, 'dist/');
}

chokidar
    .watch(`src`, {
        ignored: ['**/tsconfig.json', '**/*.(ts|tsx)']
    })
    .on('all', (event, path) => {
        if (event === 'change' || event === 'add') {
            fs.copySync(path, toDest(path));
        }
    });

childProcess.spawn(`pnpx tsc -p src -w`, { shell: true, stdio: 'inherit' });
