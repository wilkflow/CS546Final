//TODO: Add imports

//Errors
const errorText = document.getElementById("friends-error");
errorText.style.display = 'none';

function displayError(text) {
    errorText.innerHTML = text;
    errorText.style.display = 'block';
};

//Add Friend Handler
const addForm = document.getElementById("add-friend");
const friendInput = document.getElementById("friend-input");

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if(!friendInput || friendInput.value.trim().length === 0) return displayError("Enter Friend's Username to add them!");

    addForm.submit();

});

//Remove Friend
document.querySelectorAll('.remove-friend').forEach(form => {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        
    });
});