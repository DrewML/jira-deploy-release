#!/usr/bin/env node

const os = require('os');
const git = require('./git');
const { promiseReflect, getJiraIds } = require('./util');
const { addCommentToIssue, doTransition } = require('./jira');
const { proj, host, auth, transition } = require('./opts')();

const currentTag = git.getCurrentTag();
const msgs = git.getCommitMessagesInRelease();
const jiraIssues = getJiraIds(proj, msgs);

if (!jiraIssues.length) {
    console.log(
        `No Jira issues found for release ${currentTag}`
    );
    process.exit();
}

console.log(`Found ${jiraIssues.length} JIRA issue(s) in release ${currentTag}`);
console.log('Updating ticket status for the following JIRA issue(s):');
console.log(jiraIssues.join(os.EOL));

const requests = jiraIssues.map(issueId => {
    return doTransition({
        host,
        issueId,
        basicAuthString: auth,
        transitionId: String(transition)
    });
});

Promise.all(requests.map(promiseReflect)).then(results => {
    const succeeded = results.filter(result => result.resolved).length;
    const failed = results.filter(result => result.rejected).length;

    if (succeeded) console.log(`Succeeded updating ${succeeded} issue(s).`);
    if (failed) console.log(`Failed updating ${failed} issue(s).`);
});
