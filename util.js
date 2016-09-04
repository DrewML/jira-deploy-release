module.exports = {
    promiseReflect(promise) {
        return promise.then(val => ({
            val,
            resolved: true
        }), val => ({
            val,
            rejected: true
        }))
    },

    getJiraIds(issuePrefix, msgs = []) {
        return msgs.map(msg => {
            const reJiraIssue = new RegExp(`(${issuePrefix}-\\d+)`, 'i');
            const matches = msg.match(reJiraIssue);
            return matches && matches[1];
        }).filter(val => val);
    }
};
