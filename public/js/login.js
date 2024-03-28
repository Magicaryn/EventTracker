const loginFormHandler = async (event) => {
    event.preventDefault();

    // Collect values from the login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if (email && password) {
        // Send a POST request to the API endpoint
        const login = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
        });
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
    }
}

// {
//     username: 'testUser',
//     email: 'test@example.com',
//     password: 'testPassword',
//     position: 'testPosition'
// };



document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);

document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);