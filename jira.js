const got = require('got');

module.exports = {
    doTransition({ host, issueId, transitionId, basicAuthString }) {
        return got.post(`https://${host}/rest/api/2/issue/${issueId}/transitions`, {
            headers: {
                Authorization: `Basic ${basicAuthString}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                transition: String(transitionId),
                update: {
                    comment: [{
                        add: {
                            body: 'Deployed to Production.'
                        }
                    }]
                }
            })
        });
    }
};
