const os = require('os');
const { execSync } = require('child_process');

const execOpts = { encoding: 'utf8', cwd: process.cwd() };

module.exports = {
    getCurrentTag() {
        return execSync('git describe', execOpts).trimRight();
    },

    getCommitMessagesInRelease() {
        const cmd = 'git log `git describe --tags --abbrev=0 HEAD^`..HEAD --pretty=%s';
        const result = execSync(cmd, execOpts);

        return result.split(os.EOL).slice(0, -1);
    }
};
