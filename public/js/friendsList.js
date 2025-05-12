//TODO: Add checking so existing friends cannot be added

//Add Friend Handler
const addForm = document.getElementById("add-friend");
const friendInput = document.getElementById("friend-input");
const friendsList = document.getElementById("friends-list");

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = friendInput.value.trim();
    if(!username) return alert("Enter Friend's Username to add them!");

    const requestConfig = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username})
    };
    fetch('/friends/add', requestConfig).then(async (response) => {
        if(!response.ok) return alert("Failed to Add Friend");

        const newFriends = await response.json();
        friendsList.innerHTML = ``;
        newFriends.forEach(newFriend => {
            friendInput.value = '';

            const li = document.createElement('li');
            li.className = 'friend-item';
            li.dataset.friendId = newFriend._id;
            li.innerHTML = 
            `<a href="/friends/${newFriend._id}">${newFriend.name}</a>
            <form class="remove-friend">
                <input type="hidden" class="friendId-input" value="${newFriend._id}">
                <button class="remove-friend-button">Remove</button>
            </form>`;

            friendsList.append(li);

            const removeForm = li.querySelector('.remove-friend');
            removeForm.addEventListener('submit', removeFriend);
        })
        

    }).catch(() => alert("Network error while adding friend."));
});

//Remove Friend
function removeFriend(event){
    event.preventDefault();

    const removeForm = event.target;
    const friendIdInput = removeForm.querySelector(".friendId-input");
    const friendId = friendIdInput.value.trim();

    const requestConfig = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({friendId})
    };
    fetch('/friends/remove', requestConfig).then(async (response) => {
        if(!response.ok) return alert("Failed to Remove Friend");

        removeForm.closest('.friend-item').remove();
    }).catch(() => alert("Network error while removing friend."));
};

document.querySelectorAll('.remove-friend').forEach(removeForm => {
    removeForm.addEventListener('submit', removeFriend);
});
