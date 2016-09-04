const minimist = require('minimist');

module.exports = () => {
    const argv = minimist(process.argv);
    return {
        proj: argv.proj || process.env.JIRA_PROJECT,
        host: argv.host || process.env.JIRA_HOST,
        auth: argv.auth || process.env.JIRA_AUTH,
        transition: argv.transition || process.env.JIRA_TRANSITION
    };
};
