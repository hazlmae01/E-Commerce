const db = require("../DB/db-config");
const bcryt = require("bcryptjs");

const register = async(req, res) => {
    const {username, email, password:Npassword} = req.body
    if(!username ||  !Npassword ||!email ) return res.json({status: "error", error: "please Enter your username and password"});
    else{
        console.log(email);
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) =>{
            if (err) throw err;
            if(result[0]) return res.json({status: "error", error: "Email has already been registered"})
                else{
                    const password = bcrypt.hash(Npassword, 8);
                    console.log(password);
                    db.query('INSERT INTO users SET ?', {username, email: email, password: password}, (error, results) =>{
                        if(error) throw error;
                        return res.json({status: "success", success: "User has been registered"});
                    })
                }
        })
    }
}

module.exports = register;