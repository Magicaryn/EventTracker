const loginFormHandler = async (event) => {
    event.preventDefault();

    // Collect values from the login form
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();


    if (username && password) {
        // Send a POST request to the API endpoint
        const login = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }), 
            headers: { 'Content-Type': 'application/json' },
        });
        // If successful, redirect the browser to the dashboard page which redirects to the correct page based on user.position
        if (login.ok) {
            document.location.replace('/dashboard');
        } else {
            document.querySelector('.alert').innerHTML = 
            `<div class="alert alert-danger" role="alert">
            Login failed. Try again.
          </div>`;
        }
    }
}

const signupFormHandler = async (event) => {
    event.preventDefault();

    // Collect values from the signup form
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const position = document.querySelector('#position-signup').value.trim();

    if (username && email && password && position) {
        // Send a POST request to the API endpoint
        const signup = await fetch('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password, position }),
            headers: { 'Content-Type': 'application/json' },
        });
        // If successful, redirect the browser to the login page. Signing up does not log you in.
        if (signup.ok) {
            document.querySelector('.alert').innerHTML = 
            `<div class="alert alert-success" role="alert">
            Account created! <a href="/login" class="alert-link">Login</a>.
          </div>`;
        }
        else {
            document.querySelector('.alert').innerHTML = `<div class="alert alert-danger" role="alert">
            Error creating account. Check that your password is at least 8 characters. Please try again.
          </div>`;
        }
    }
  

    
}

//if statements are needed since this document is on both the login and signup page. 
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', loginFormHandler);
}
const signupForm = document.querySelector('.signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', signupFormHandler);
}