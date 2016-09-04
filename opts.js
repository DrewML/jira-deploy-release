const argv = require('minimist')(process.argv);

module.exports = () => ({
    proj: process.env.JIRA_PROJECT || argv.proj,
    host: process.env.JIRA_HOST || argv.host,
    auth: process.env.JIRA_AUTH || argv.auth,
    transition: process.env.JIRA_TRANSITION || argv.transition
});
