let next, previous;

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts(`/saved_posts/1?page=1`);

    document.querySelector('#previous-btn').addEventListener('click', () => {
        fetchPosts(previous);
    });

    document.querySelector('#next-btn').addEventListener('click', () => {
        fetchPosts(next);
    });
});

function fetchPosts(pageUrl) {
    document.querySelector('#posts').innerHTML = '';

    fetch(pageUrl)
    .then(response => response.json())
    .then(data => {
        data.results.forEach(addPost);
        
        if (data.previous == null)
            document.querySelector('#previous-btn').disabled = true;
        else
            document.querySelector('#previous-btn').disabled = false;
        
        if (data.next == null)
            document.querySelector('#next-btn').disabled = true;
        else
            document.querySelector('#next-btn').disabled = false;

        next = data.next;
        previous = data.previous;
    });
}

function addPost(post) {
    let newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.id = post.id;

    // Get the current user
    user = document.querySelector('#user').innerHTML;
    
    // If user was the poster, display edit button in addition to the post
    if (user == post.poster.username) {
        newPost.innerHTML = `
            <a href="/userview/${post.poster.username}" style="color: black"><strong>You</strong></a>
            <hr>
            <button class="btn btn-link" style="display: none" onclick="saveEdit(this, ${post.id})">Save</button>
            <button class="btn btn-link" style="display: none" onclick="cancelEdit(this)">Cancel</button>
            <button class="btn btn-link" onclick="edit(this)">Edit</button>
            <p class="post-body" style="white-space: pre-wrap; over-">${post.body}</p>
            <textarea class="edit-textarea" style="display: none">${post.body}</textarea>
            <p style="color: gray;">${post.timestamp}</p>
            <div>
                <input class="like-btn" type="image" src="../../static/network/img/heart-pink.png"
                    width="20px" height="20px" style="display: none" onclick="like(this, ${post.id})">
                <input class="dislike-btn" type="image" src="../../static/network/img/heart-red-filled.png"
                    width="20px" height="20px" style="display: none" onclick="dislike(this, ${post.id})">
                    <span>${post.likes}</span>
                <input class="save-btn" type="image" src="../../static/network/img/save-black.png"
                    width="20px" height="20px" style="display: none" onclick="save(this, ${post.id})">
                <input class="unsave-btn" type="image" src="../../static/network/img/save-green-filled.png"
                    width="20px" height="20px" style="display: none" onclick="unsave(this, ${post.id})">
            </div>`;

        // Check if user has liked/saved the post or not
        let likers = post.likers;
        let savers = post.savers;
        let liked = false, saved = false;
        likers.forEach((liker) => {
            if (user == liker.username) {
                liked = true;
            }
        })
        savers.forEach(saver => {
            if (user == saver.username) {
                saved = true;
            }
        })

        // Either display like/save button or dislike/unsave button regarding the user
        if (liked) {
            newPost.children[8].children[1].style.display = '';
        }
        else {
            newPost.children[8].children[0].style.display = '';
        }

        if (saved) {
            newPost.children[8].children[4].style.display = '';
        }
        else {
            newPost.children[8].children[3].style.display = '';
        }
    }
    else {
        newPost.innerHTML = `
            <a href="/userview/${post.poster.username}" style="color: black"><strong>${post.poster.username}</strong></a>
            <hr>
            <p style="white-space: pre-wrap;">${post.body}</p>
            <p style="color: gray;">${post.timestamp}</p>
            <div>
                <input class="like-btn" type="image" src="../../static/network/img/heart-pink.png"
                    width="20px" height="20px" style="display: none" onclick="like(this, ${post.id})">
                <input class="dislike-btn" type="image" src="../../static/network/img/heart-red-filled.png"
                    width="20px" height="20px" style="display: none" onclick="dislike(this, ${post.id})">
                <span>${post.likes}</span>
                <input class="save-btn" type="image" src="../../static/network/img/save-black.png"
                    width="20px" height="20px" style="display: none" onclick="save(this, ${post.id})">
                <input class="unsave-btn" type="image" src="../../static/network/img/save-green-filled.png"
                    width="20px" height="20px" style="display: none" onclick="unsave(this, ${post.id})">
            </div>`;

        // Check if user has liked/saved the post or not
        let likers = post.likers;
        let savers = post.savers;
        let liked = false, saved = false;
        likers.forEach((liker) => {
            if (user == liker.username) {
                liked = true;
            }
        })
        savers.forEach(saver => {
            if (user == saver.username) {
                saved = true;
            }
        })

        // Either display like/save button or dislike/unsave button regarding the user
        if (liked) {
            newPost.children[4].children[1].style.display = '';
        }
        else {
            newPost.children[4].children[0].style.display = '';
        }

        if (saved) {
            newPost.children[4].children[4].style.display = '';
        }
        else {
            newPost.children[4].children[3].style.display = '';
        }
    }

    // Add the post to #posts
    document.querySelector('#posts').append(newPost);
}

function like(btn, postId) {
    // Like post
    fetch(`/likepost/1/${postId}`, {
        method: 'PUT'
    });
    btn.style.display = 'none';
    btn.nextElementSibling.style.display = '';

    // Update post's likes count on the page
    fetch(`/post/${postId}`)
    .then(response => response.json())
    .then(data => {
        let counts = btn.nextElementSibling.nextElementSibling;
        if (counts.innerHTML != data.likes){
            counts.innerHTML = data.likes;
        }
        else {
            counts.innerHTML = parseInt(counts.innerHTML) + 1;
        }
    });
}

function dislike(btn, postId) {
    // Dislike post
    fetch(`/likepost/0/${postId}`, {
        method: 'PUT'
    });
    btn.style.display = 'none';
    btn.previousElementSibling.style.display = '';

    // Update post's likes count on the page
    fetch(`/post/${postId}`)
    .then(response => response.json())
    .then(data => {
        let counts = btn.nextElementSibling;
        if (counts.innerHTML != data.likes){
            counts.innerHTML = data.likes;
        }
        else {
            counts.innerHTML = parseInt(counts.innerHTML) - 1;
        }
    });
}

function save(btn, postId) {
    fetch(`/savepost/1/${postId}`, {
        method: 'PUT'
    })
    btn.style.display = 'none';
    btn.nextElementSibling.style.display = '';
}

function unsave(btn, postId) {
    fetch(`/savepost/0/${postId}`, {
        method: 'PUT'
    })
    btn.style.display = 'none';
    btn.previousElementSibling.style.display = '';
}

function edit(btn) {
    let postBody = btn.nextElementSibling;
    let bodyTextArea = postBody.nextElementSibling;
    let cancelBtn = btn.previousElementSibling;
    let saveBtn = cancelBtn.previousElementSibling;

    // Display edit textarea, cancel button and save button
    postBody.style.display = 'none';
    btn.style.display = 'none';
    bodyTextArea.style.display = 'block';
    cancelBtn.style.display = '';
    saveBtn.style.display = '';
}

function cancelEdit(btn) {
    let saveBtn = btn.previousElementSibling;
    let editBtn = btn.nextElementSibling;
    let postBody = editBtn.nextElementSibling;
    let bodyTextArea = postBody.nextElementSibling;

    // Hide textarea, cancel button and save button and display the post
    btn.style.display = 'none';
    saveBtn.style.display = 'none';
    bodyTextArea.style.display = 'none';
    editBtn.style.display = '';
    postBody.style.display = '';
}

function saveEdit(btn, postId) {
    let cancelBtn = btn.nextElementSibling;
    let editBtn = cancelBtn.nextElementSibling;
    let postBody = editBtn.nextElementSibling;
    let bodyTextArea = postBody.nextElementSibling;

    // Edit post's body
    fetch(`/editpost/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
            body: bodyTextArea.value
        })
    });

    // update post's body on the page
    postBody.innerHTML = bodyTextArea.value;

    // Hide textarea, cancel button and save button and display the post
    btn.style.display = 'none';
    cancelBtn.style.display = 'none';
    bodyTextArea.style.display = 'none';
    editBtn.style.display = '';
    postBody.style.display = '';
}
