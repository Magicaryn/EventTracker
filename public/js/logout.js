//function that runs when the logout button is clicked
const logout = async () => {
    const logout = await fetch('/api/users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (logout.ok) {
      document.location.replace('/');
    } 
  }

  
  document.querySelector('#logout').addEventListener('click', logout);
  
  