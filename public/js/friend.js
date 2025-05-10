//Adding Comments to Friend's Post
const postsFeed = document.querySelector(".posts-feed");

function addComment(event){
    event.preventDefault();

    const commentForm = event.target;
    const commentInput = commentForm.querySelector(".comment-input");
    const postId = commentForm.closest(".post-item").dataset.postId;

    const comment = commentInput.value.trim();
    if(!comment) return alert("Comment cannot be empty!");

    const requestConfig = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId, comment})
    };
    fetch("/friends/comment", requestConfig).then(async (response) => {
        if(!response.ok) return alert("Failed to add comment");

        const newComment = await response.json();

        const comments = commentForm.previousElementSibling;
        const commentDiv = document.createElement("div");
        commentDiv.innerHTML = 
            `<p class="comment-poster">${newComment.name} &emsp; ${newComment.postedDate}</p>
            <p class="comment-body">${newComment.comment}</p>`;
        
        comments.appendChild(commentDiv);
        commentInput.value = "";

    }).catch(() => alert("Network error while liking post"));
};

document.querySelectorAll(".comment-form").forEach(form => {
    form.addEventListener("submit", addComment);
});

//Like Friend's Posts
function likeButton(event){
    const likeButton = event.target;
    const postDiv = likeButton.closest(".post-item");
    const postId = postDiv.dataset.postId;

    const requestConfig = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({postId})
    }
    fetch("/friends/like", requestConfig).then(async (response) => {
        if (!response.ok) return alert("Failed to like post");

        const data = await response.json();
        const likesText = postDiv.querySelector(".post-likes");
        likesText.textContent = `Current Likes: ${data.likes}`;
        
    }).catch(() => alert("Network error while liking post"));
};

document.querySelectorAll(".like-button").forEach(button => {
    button.addEventListener("click", likeButton);
});
