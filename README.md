# AD-LDAP-HELPER
---

A module with some helper functions to authenticate a Microsoft Active Directory user or lookup a user's info with a default account.

Dependencies: 
- dotenv
- activedirectory2

Requires .env file in root of project with the following environmental variables:
- LDAP_URL: Active Directory server to connect to, e.g. ldap://ad.example.com
- BASE_DN: The root DN from which all searches will be performed, e.g. dc=example,dc=com
- AD_USER: default ad user (hopefully not a real user's account!)
- AD_PASSWD: default ad user's password

### Methods
loginADUser(username: string, password: string, attributes?: Array<string>): User|null

Attempts to authenticate a user with a given sAMAccountName and password. If unsuccessful, it returns null. If successful it returns a user object with:
- sAMAccountName
- givenName (firstname)
- sn (surname)
- telephoneNumber
- mail (email)
- l (location)
- ... any attributes included in the optional 3rd argument (an array of strings)

getADUserInfo(username: string, attributes?: Array<string>): Promise<User|null>
Authenticates with a default user whose sAMAccountName and password are defined in a .env file. If unsuccessful, it returns a Promise rejection with null. If successful it returns a Promise resolve with the user object:
- sAMAccountName
- givenName (firstname)
- sn (surname)
- telephoneNumber
- mail (email)
- l (location)
- ... any attributes included in the optional 3rd argument (an array of strings)

getADUserGroups(username: string, attributes?: Array<string>): Promise<Array<Group>|null>
Authenticates with a default user whose sAMAccountName and password are defined in a .env file. If unsuccessful, it returns a Promise rejection with null.  If successful it returns a Promise resolve with the user's groups:
        [
            Group {
                dn,
                cn,
                description,
                distinguishedName,
                objectCategory
            },
            ...
        ]

getADUsersForGroup(groupname: string): Promise<Array<User>|null>
Authenticates with a default user whose sAMAccountName and password are defined in a .env file. If 
unsuccessful, it returns a Promise rejection with null. If successful, it returns a Promise resolve
with a list of users belonging to the AD group:
        [
            User {
                sAMAccountName,
                givenName,
                sn,
                mail,
                l,
            },
            ...
        ]
