const postForm = document.getElementById("post-form");
const postText = document.getElementById("post-text");
const postFeed = document.querySelector(".posts-feed");

//Adding Posts
postForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = postText.value.trim();
    if(!text) return alert("Cannot add an empty post!");

    const requestConfig = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({body: text})
    };
    fetch("/friends/post", requestConfig).then(async (response) => {
        if(!response.ok) return alert("Failed to add post");

        const newPost = await response.json();

        const postDiv = document.createElement('div');
        postDiv.className = "post-item";
        postDiv.dataset.postId = newPost._id;
        postDiv.innerHTML = 
            `<h4 class="friend-poster">${newPost.name} &emsp; ${newPost.postedDate}</h4>
            <p class="friend-post">${newPost.body}</p>

            <button class="like-button">Like</button>
            <p class="post-likes">Current Likes: 0</p>

            <div class="post-comments"></div>

            <form method="POST" class="comment-form">
                <input type="text" class="comment-input" placeholder="Write a comment">
                <button type="submit" class="add-comment">Comment</button>
            </form>`;
        postFeed.prepend(postDiv);
        postText.value = "";

        const commentForm = postDiv.querySelector(".comment-form");
        commentForm.addEventListener("submit", addComment);

        const likeButton = postDiv.querySelector(".like-button");
        likeButton.addEventListener("click", likePost);

    }).catch(() => alert("Network error while adding post"));
});

//Adding Comments
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

    }).catch(() => alert("Network error while adding comment"));
};

document.querySelectorAll(".comment-form").forEach(form => {
    form.addEventListener("submit", addComment);
});

//Like Posts
function likePost(event){
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
    button.addEventListener("click", likePost);
});
