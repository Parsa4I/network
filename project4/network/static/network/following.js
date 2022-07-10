// import * as index from './index.js'

let next, previous;

document.addEventListener('DOMContentLoaded', () => {
    const userId = document.querySelector('#user-id').innerHTML;

    fetchPosts(`/following_posts/${userId}?page=1`);

    document.querySelector('#previous-btn').addEventListener('click', () => {
        fetchPosts(previous);
    });

    document.querySelector('#next-btn').addEventListener('click', () => {
        fetchPosts(next);
    });
})

function fetchPosts(pageUrl) {
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
    })
}

function addPost(post) {
    let newPost = document.createElement('div');
    newPost.className = 'post';
    newPost.id = post.id;

    // Get the current user
    user = document.querySelector('#user').innerHTML;
    
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
