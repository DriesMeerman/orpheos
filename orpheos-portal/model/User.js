const bcrypt =   require('bcryptjs');

const SALTCOUNT = 12;
const HASH = bcrypt.genSaltSync(SALTCOUNT);


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
	}

	checkPassword(passwordToCheck) {
        console.log("checking password", passwordToCheck, this.password);
        let result =  bcrypt.compareSync(passwordToCheck, this.password);
        console.log('password was correct: ', result);
        return result;
    }

    hashPassword(password){
        password = this.password ? this.password : password;
        return bcrypt.hashSync(password, SALTCOUNT);
    }
}

module.exports = User;