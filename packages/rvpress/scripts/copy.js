const fs = require('fs-extra');
const glob = require('globby');

const args = process.argv.slice(2);
const project = args[0];
if (!project) throw new Error('Must provide copy project');

function toDest(file) {
    return file.replace(/^src\//, 'dist/');
}

glob.sync(`src/${project}/**/`, { ignore: ['**/*.(ts|tsx)', '**/tsconfig.json'] }).forEach(file => {
    fs.copy(file, toDest(file));
});
