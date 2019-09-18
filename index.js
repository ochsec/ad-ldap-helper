const dotenv = require('dotenv');
const ActiveDirectory = require('activedirectory2');
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

const getADUserInfo = (username, attributes) => {
    const config = getConfig(null, null, attributes);
    const ad = new ActiveDirectory(config);
    
    return new Promise((resolve, reject) => {
        ad.authenticate(config.username, config.password, function(err, auth) {
            if (err) {
                console.log('ERROR: '+JSON.stringify(err));
                reject(null);
            }
           
            if (auth) {
                console.log('Client user authenticated!');
                console.log(`Finding user ${username}`);
    
                ad.findUser(username, function (err, user) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        reject(null);
                    }
        
                    if (!user) {
                        console.log(`User: ${username} not found.`);
                        reject(null);   
                    } else {
                        console.log('Found user: ' + user.sAMAccountName);
                        resolve(user);
                    }
                });
            } else {
                console.log('Authentication failed!');
                reject(null);
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
                console.log('ERROR: '+JSON.stringify(err));
                reject(null);
            }
           
            if (auth) {
                console.log('Client user authenticated!');
                console.log(`Finding user ${username}`);
    
                ad.findUser(username, function (err, user) {
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        reject(null);
                    }
        
                    if (!user) {
                        console.log(`User: ${username} not found.`);
                        reject(null);   
                    } else {
                        console.log('Found user: ' + user.sAMAccountName);
                        resolve(user);
                    }
                });
            } else {
                console.log('Authentication failed!');
                reject(null);
            }
        });
    });
}

module.exports = {
    getADUserInfo,
    loginADUser,
}
