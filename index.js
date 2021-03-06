const dotenv = require('dotenv');
const ActiveDirectory = require('activedirectory2');

const errors = {
    AUTH_FAILED: 'Authentication failed!',
    NOT_FOUND: (username) => `User: ${username} not found.`,
    GENERIC: (error) => `Error: ${JSON.stringify(error)}`,
};

const getConfig = (username, password, extraAttributes) => {
    dotenv.config();

    attributes = [
        'sAMAccountName', 
        'givenName', 
        'sn', 
        'telephoneNumber', 
        'mail',
        'l',
    ];

    if (extraAttributes) {
        attributes = [...attributes, ...extraAttributes];
    }

    return {
        url: process.env.LDAP_URL,
        baseDN: process.env.BASE_DN,
        username: username || process.env.AD_USER,
        password: password || process.env.AD_PASSWD,
        attributes: {
            user: attributes,
        }
    }
};

const getADGroupUsers = (groupname) => {
    const config = getConfig(null, null, null);
    const ad = new ActiveDirectory(config);

    return new Promise((resolve, reject) => {
        ad.authenticate(config.username, config.password, function (err, auth) {
            if (err) {
                console.log(errors.GENERIC(err));
                reject(errors.GENERIC(err));
            }

            if (auth) {
                console.log('Client user authenticated!');
                console.log(`Finding user members of ${groupname}`);

                ad.getUsersForGroup(groupname, function (err, users) {
                    if (err) {
                        console.log(errors.GENERIC(err));
                        reject(errors.GENERIC(err));
                    }

                    if (!users) {
                        console.log(errors.NOT_FOUND(groupname));
                        reject(errors.NOT_FOUND(groupname));
                    } else {
                        console.log(`Found ${users.length} users for group ${groupname}.`);
                        resolve(users);
                    }
                });
            } else {
                console.log(errors.AUTH_FAILED);
                reject(errors.AUTH_FAILED);
            }
        });
    });
};

const getADUserGroups = (username) => {
    const config = getConfig(null, null, null);
    const ad = new ActiveDirectory(config);

    return new Promise((resolve, reject) => {
        ad.authenticate(config.username, config.password, function (err, auth) {
            if (err) {
                console.log(errors.GENERIC(err));
                reject(errors.GENERIC(err));
            }

            if (auth) {
                console.log('Client user authenticated!');
                console.log(`Finding group memberships for ${username}`);

                ad.getGroupMembershipForUser(username, function (err, groups) {
                    if (err) {
                        console.log(errors.GENERIC(err));
                        reject(errors.GENERIC(err));
                    }
        
                    if (!groups) {
                        console.log(errors.NOT_FOUND(username));
                        reject(errors.NOT_FOUND(username));   
                    } else {
                        console.log(`Found ${groups.length} groups for user ${username}.`);
                        resolve(groups);
                    }
                });
            } else {
                console.log(errors.AUTH_FAILED);
                reject(errors.AUTH_FAILED);
            }
        });
    });
};

const getADUserInfo = (username, attributes) => {
    const config = getConfig(null, null, attributes);
    const ad = new ActiveDirectory(config);
    
    return new Promise((resolve, reject) => {
        ad.authenticate(config.username, config.password, function(err, auth) {
            if (err) {
                console.log(errors.GENERIC(err));
                reject(errors.GENERIC(err));
            }
           
            if (auth) {
                console.log('Client user authenticated!');
                console.log(`Finding user ${username}`);
    
                ad.findUser(username, function (err, user) {
                    if (err) {
                        console.log(errors.GENERIC(err));
                        reject(errors.GENERIC(err));
                    }
        
                    if (!user) {
                        console.log(errors.NOT_FOUND(username));
                        reject(errors.NOT_FOUND(username));   
                    } else {
                        const msg = 'Found user: ' + user.sAMAccountName
                        console.log(msg);
                        resolve(user);
                    }
                });
            } else {
                console.log(errors.AUTH_FAILED);
                reject(errors.AUTH_FAILED);
            }
        });
    });
}

const loginADUser = (username, password, attributes) => {
    return new Promise((resolve, reject) => {
        const config = getConfig(username, password, attributes);   
        const ad = new ActiveDirectory(config);
        
        ad.authenticate(config.username, password, function(err, auth) {
            if (err) {
                console.log(errors.GENERIC(err));
                reject(errors.GENERIC(err));
            }
           
            if (auth) {
                console.log('Client user authenticated!');
                console.log(`Finding user ${username}`);
    
                ad.findUser(username, function (err, user) {
                    if (err) {
                        const msg = 'ERROR: ' + JSON.stringify(err);
                        console.log(msg);
                        reject(msg);
                    }
        
                    if (!user) {
                        console.log(errors.NOT_FOUND(username));
                        reject(errors.NOT_FOUND(username));   
                    } else {
                        console.log('Found user: ' + user.sAMAccountName);
                        resolve(user);
                    }
                });
            } else {
                console.log(errors.AUTH_FAILED);
                reject(errors.AUTH_FAILED);
            }
        });
    });
}

module.exports = {
    getADUserInfo,
    getADUserGroups,
    loginADUser,
    getADGroupUsers,
}
