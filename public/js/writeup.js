
const writeUpModal = document.getElementById('writeUpModal'); 

const writeUpHandler = async (event) => {
    event.preventDefault();

    const managerTemp = document.querySelector('#manager').textContent.trim();
    const manager = managerTemp.split('Manager: ')[1];

    const userTemp = document.querySelector('#userDropdown option:checked').value.trim();
    const user_id = parseInt(userTemp.split('option')[1]);

    const reason = document.querySelector('#reasonDropdown option:checked').value.trim();
    const content = document.querySelector('#commentsTextArea').value.trim();
    //type needs to see which checkbox is selected
    const selectedCheckbox = document.querySelector('input[name="checkbox"]:checked');
    const type = selectedCheckbox ? selectedCheckbox.value : null;
    const acknowledged = false;

    

    if (manager && type && reason && content && user_id) {
        const response = await fetch('/api/users/writeup', {
            method: 'POST',
            body: JSON.stringify({ manager, type, reason, content, user_id, acknowledged }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to create write up');
        }
    }
}

if(writeUpModal){
    writeUpModal.addEventListener('hidden.bs.modal', writeUpHandler);
}


