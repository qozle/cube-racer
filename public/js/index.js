
$(function(){
	//  On login form submit
	$('#login').submit(function(e){
		e.preventDefault();
		var email = validEmail($('#login-user').val());
		!email && $('#li-userError').text('Invalid email format');	
		var password = validPassword($('#login-password').val());
		!password && $('#li-passwordError').text('Invalid password format');
		//  If everything's cool, send it on over to check on the server database
		if (email && password){
			var loginData = {
				email: email,
				password: password}
			$.ajax({
				url: '/login',
				type: 'POST',
				data: loginData,
				success: function(result){
					var html = result.html;
					var user = result.user;
					$('#main-content').remove();
					$('#main-container').append(html);
					localStorage.handle = user;
				},
				error: function(error){
					console.log(error)
				}
			});
		}
	});
	
	//  On signup form submit
	$('#signup').submit(function(e){
		e.preventDefault();
		
		//  Gather and validate form data
		var firstname = validName($('#firstname').val());
		!firstname && $('#su-firstNameError').text('Invalid name');
		var lastname = validName($('#lastname').val());
		!lastname && $('#su-lastNameError').text('Invalid name');
		var handle = validHandle($('#handle').val());
		!handle && $('#su-handleError').text('Handle must be 8-20 alphanumeric chars + "." and "_"');
		var email = validEmail($('#email').val());
		!email && $('#su-emailError').text('Invalid E-mail format');
		var password = validPassword($('#password').val());
		var passwordConfirm = validPassword($('#passwordConfirm').val());		
		!password && $('#su-passwordError').text('Invalid password');
		(password != passwordConfirm) && $('#su-passwordConfirmError').text('Passwords must match');
		var bdayMonth = $('#bdayMonth').val();
		(bdayMonth == 'Month') && $('#bdayMonthError').text('Must select a month');
		var bdayDay = $('#bdayDay').val();
		(bdayDay == 'Day') && $('#bdayDayError').text('Must select a day');
		var bdayYear = $('#bdayYear').val();
		(bdayYear == 'Year') && $('#bdayYearError').text('Must select a year');
		
		//  If nothing's wrong, send it on over via 
		//  ajax POST request
		if (firstname && lastname && handle && email && password && password == passwordConfirm && bdayMonth != 'Month' && bdayDay != 'Day' && bdayYear != 'Year') {
			var signupData = {
				firstname: firstname,
				lastname: lastname,
				handle: handle,
				email: email,
				password: password,
				bmonth: bdayMonth,
				bday: bdayDay,
				byear: bdayYear
				
			}
			$.ajax({
				url: '/signup',
				type: 'POST',
				data: signupData,
				success: function(result){
					$('#main-content').remove();
					$('#main-container').append(result);
				},
				error: function(error){
					console.log(error)
				}
			});
		}
	});
	
	
	//  here, have some V A L I D A T I O N  F U N C T I O N S
	
	
	//  Check that email is in valid format
    function validEmail(email) {
        email = escapeHtml(email);
        email = email.toLowerCase();
        email = email.trim();
        let reg = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (reg.test(email)){
            return email
        } else {
            return false;
        }
    }


    //  Check that name data is in valid format
    function validName(name){
        name = escapeHtml(name);
        name = name.toLowerCase();
        name = name.trim();
        // regex = at least one capital or lowercase letter
        let reg = /^[a-zA-Z]+$/;
        if (reg.test(name)){
            return name
        } else {
            return false;
        }
    }
	
	function validHandle(handle) {
		handle = escapeHtml(handle);
		handle = handle.trim();
		let reg = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
		if (reg.test(handle)) {
			return handle
		} else {
			return false;
		}
	}


    //  Check that password is in valid format
    function validPassword(password){
        password = escapeHtml(password);
        password = password.trim();
        /* Password must match 3 of 4 Character catagories: 
        1.) at least 1 upper case character 
        2.) at least 1 lower case character 
        3.) at least 1 numerical character 
        4.) at least 1 special character */
        let reg = /(?=^.{6,255}$)((?=.*\d)(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[^A-Za-z0-9])(?=.*[a-z])|(?=.*[^A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z])|(?=.*\d)(?=.*[A-Z])(?=.*[^A-Za-z0-9]))^.*/;
        if (reg.test(password)) {
            return password;
        } else {
            return false;
        }
    }


    // Replace some HTML chararters to prevent injection
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }
	
	
});