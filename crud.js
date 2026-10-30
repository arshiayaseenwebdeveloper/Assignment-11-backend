var api = "https://jsonplaceholder.typicode.com/posts";
var posts = [];

var postsDiv = document.getElementById("posts");
var message = document.getElementById("message");
var count = document.getElementById("count");

// GET: Load the first six posts
function loadPosts() {
    message.innerText = "Loading posts...";

    fetch(api + "?_limit=6")
        .then(function(response) {
            console.log("GET status:", response.status);

            if (!response.ok) {
                throw new Error("Could not load posts");
            }

            return response.json();
        })
        .then(function(data) {
            posts = data;
            showPosts();
            message.innerText = "Posts loaded successfully!";
        })
        .catch(function(error) {
            message.innerText = error.message;
        });
}

// Show all posts on the page
function showPosts() {
    postsDiv.innerHTML = "";
    count.innerText = posts.length + " posts shown";

    posts.forEach(function(post) {
        var card = document.createElement("div");
        card.className = "post";

        card.innerHTML =
            "<small>Post ID: " + post.id + " · User ID: " + post.userId + "</small>" +
            "<h4></h4><p></p>";

        card.querySelector("h4").innerText = post.title;
        card.querySelector("p").innerText = post.body;

        var putButton = document.createElement("button");
        putButton.innerText = "PUT full update";
        putButton.className = "green";
        putButton.onclick = function() {
            updatePost(post.id, "put");
        };

        var patchTitleButton = document.createElement("button");
        patchTitleButton.innerText = "PATCH title";
        patchTitleButton.onclick = function() {
            updatePost(post.id, "title");
        };

        var patchBodyButton = document.createElement("button");
        patchBodyButton.innerText = "PATCH body";
        patchBodyButton.onclick = function() {
            updatePost(post.id, "body");
        };

        var deleteButton = document.createElement("button");
        deleteButton.innerText = "DELETE";
        deleteButton.className = "red";
        deleteButton.onclick = function() {
            deletePost(post.id);
        };

        card.appendChild(putButton);
        card.appendChild(patchTitleButton);
        card.appendChild(patchBodyButton);
        card.appendChild(deleteButton);

        postsDiv.appendChild(card);
    });
}

// POST: Add a new post
document.getElementById("postForm").onsubmit = function(event) {
    event.preventDefault();

    var newPost = {
        title: document.getElementById("title").value,
        body: document.getElementById("body").value,
        userId: Number(document.getElementById("userId").value)
    };

    fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newPost)
    })
    .then(function(response) {
        console.log("POST status:", response.status);

        if (!response.ok) {
            throw new Error("Could not add post");
        }

        return response.json();
    })
    .then(function(data) {
        posts.unshift(data);
        showPosts();
        document.getElementById("postForm").reset();
        document.getElementById("userId").value = 1;
        message.innerText = "Post added successfully!";
    })
    .catch(function(error) {
        message.innerText = error.message;
    });
};

// PUT updates the full post. PATCH updates only one field.
function updatePost(id, type) {
    var post = posts.find(function(item) {
        return item.id === id;
    });

    var updatedPost = {};
    var method = "PATCH";

    if (type === "put") {
        var newTitle = prompt("Enter new title:", post.title);
        if (newTitle === null) return;

        var newBody = prompt("Enter new content:", post.body);
        if (newBody === null) return;

        updatedPost = {
            title: newTitle,
            body: newBody,
            userId: post.userId
        };
        method = "PUT";
    } else if (type === "title") {
        var title = prompt("Enter new title:", post.title);
        if (title === null) return;
        updatedPost = { title: title };
    } else {
        var body = prompt("Enter new content:", post.body);
        if (body === null) return;
        updatedPost = { body: body };
    }

    fetch(api + "/" + id, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedPost)
    })
    .then(function(response) {
        console.log(method + " status:", response.status);

        if (!response.ok) {
            throw new Error("Update failed");
        }

        return response.json();
    })
    .then(function(data) {
        posts = posts.map(function(item) {
            if (item.id === id) {
                return Object.assign({}, item, updatedPost, data);
            }
            return item;
        });

        showPosts();
        message.innerText = method + " completed successfully!";
    })
    .catch(function(error) {
        message.innerText = error.message;
    });
}

// DELETE: Remove a post
function deletePost(id) {
    if (!confirm("Are you sure you want to delete this post?")) {
        return;
    }

    fetch(api + "/" + id, {
        method: "DELETE"
    })
    .then(function(response) {
        console.log("DELETE status:", response.status);

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        posts = posts.filter(function(post) {
            return post.id !== id;
        });

        showPosts();
        message.innerText = "Post deleted successfully!";
    })
    .catch(function(error) {
        message.innerText = error.message;
    });
}

// Load posts when page opens
document.getElementById("reload").onclick = loadPosts;
loadPosts();
