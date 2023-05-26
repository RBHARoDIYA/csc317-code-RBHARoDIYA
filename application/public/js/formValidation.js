const username = documrnt.getElementById('username');
const Email = documrnt.getElementById('Email');
const Password = documrnt.getElementById('Password');
const ConfirmPassword = documrnt.getElementById('Confirm Password');

 // more email validate
 const isEmail = (EmailVal) => {
    var atSymbol = EmailVal.indexof("@");
    if (atSymbol < 1) return false;
    var dot = EmailVal.lastIndexof('.');
    if (dot <= atSymbol + 4) return false;
    if (dot === EmailVal.lenth - 1) return false;
    return true;
 }
//define the validate function 




/*validateUser = (string) => {                    // this function is for username.
    if (string.length < 3) {                      //   to place 3 characters a minimum
        window.alert("Please enter the username with at least 3 or more characters ([a-zA-Z]).");        // show the alert
        string.focus();
        return false;
    }
};*/
validateInput = (string, obj) => {
    if (string === '') {
        window.alert("Please enter a " + obj);
        string.focus();
        return false;
    }
};

validateRegistration = () => {
    const validate = () => {
        const usernameVal = username.value.trim();
        const EmailVal = Email.value.trim();
        const PasswordVal = Password.value.trim();
        const ConfirmPasswordVal = ConfirmPassword.value.trim();
    }
} 
 // validate username
 validateUser = (string) => {
    if (usernameVal === "") {
       setErrormsg(username, 'username cantnot be blank');
   } else if (usernameVal.lenth <= 4) {
       setErrormsg(username, 'username min ');
   } else {
       setSuccessMsg(username);
   }
   };
   // validate Email
   validateUser = (string) => {
   if (EmailVal === "") {
    setErrormsg(Email, 'Email cantnot be blank');
} else if (!isEmail(EmailVal)) {
    setErrormsg(Email, 'Email Not Valide ');
} else {
    setSuccessMsg(Email);
}
    } ; 

 // validate Password 
 validateUser = (string) => {
    if (PasswordVal === "")
     {
        setErrormsg(Password, 'Password cantnot be blank');
    } else if (PasswordVal.length <= 7) {
        setErrormsg(Password, 'Password Min 8 char  ');
    } else {
        setSuccessMsg(Email);
    }
};
    // validate Conform Password 
    if (ConformPasswordVal === "") {
        setErrormsg(Password, 'Conform Password cantnot be blank');
    } else if (PasswordVal!===ConformPasswordVal) 
    {
        setErrormsg(Password, 'Password Are Not Match');
    } 
    else {setSuccessMsg(Email);
    };
   