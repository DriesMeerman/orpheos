const bcrypt =   require('bcryptjs');

const SALTCOUNT = 12;

class User {

	constructor(userObj = {}, hashPassword = false) {
        this.id = userObj.id || null;
        this.displayName = userObj.displayName || userObj.display_name || null;
        this.username = userObj.username || userObj.user_name || null;
        
        let password = hashPassword ? this.hashPassword(userObj.password) : userObj.password;

		this.password = password || null;
		this.email = userObj.email || null;
		this.created = userObj.created || Date.now();
        this.updated = userObj.updated || Date.now();
        this.accessLevel = userObj.accessLevel || userObj.access_level || 0;
	}

	checkPassword(passwordToCheck) {
        let result =  bcrypt.compareSync(passwordToCheck, this.password);
        return result;
    }

    hashPassword(password){
        password = this.password ? this.password : password;
        return bcrypt.hashSync(password, SALTCOUNT);
    }
}

module.exports = User;