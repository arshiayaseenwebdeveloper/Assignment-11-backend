
let api = "https://jsonplaceholder.typicode.com/posts";

let message = document.getElementById("message");
let result = document.getElementById("result");


// Reusable function for API requests
async function sendRequest(url, method, body) {

    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    };


    if (body) {
        options.body = JSON.stringify(body);
    }

    let response = await fetch(url, options);

    console.log(method + " status:", response.status);

    let data = null;

    if (response.status !== 204) {
        data = await response.json();
    }

    if (!response.ok) {
        throw new Error("Request failed! Status: " + response.status);
    }

    return {
        status: response.status,
        data: data
    };
}


// Display API response
function showResult(text, data) {

    message.innerText = text;

    message.className = "";

    result.innerText = JSON.stringify(data, null, 2);

}


// POST: Create a new post
document.getElementById("postForm").onsubmit = async function(event) {

    event.preventDefault();

    let newPost = {
        title: document.getElementById("title").value,
        body: document.getElementById("content").value,
        userId: Number(document.getElementById("userId").value)
    };

    try {

        message.innerText = "Sending POST request...";

        let response = await sendRequest(api, "POST", newPost);

        showResult(
            "POST successful! Status: " + response.status +
            " | Returned ID: " + response.data.id,
            response.data
        );

    } catch (error) {

        message.innerText = error.message;
        message.className = "error";

    }

};


// PUT: Replace the complete post
document.getElementById("putButton").onclick = async function() {

    let fullPost = {
        id: 1,
        title: "Updated announcement",
        body: "This is the complete updated post content.",
        userId: 1
    };

    try {

        message.innerText = "Sending PUT request...";

        let response = await sendRequest(api + "/1", "PUT", fullPost);

        showResult(
            "PUT successful! Status: " + response.status,
            response.data
        );

    } catch (error) {

        message.innerText = error.message;
        message.className = "error";

    }

};


// PATCH: Update only the title
document.getElementById("patchButton").onclick = async function() {

    let changeTitle = {
        title: "Only the title has been changed"
    };

    try {

        message.innerText = "Sending PATCH request...";

        let response = await sendRequest(api + "/1", "PATCH", changeTitle);

        showResult(
            "PATCH successful! Status: " + response.status,
            response.data
        );

    } catch (error) {

        message.innerText = error.message;
        message.className = "error";

    }

};


// DELETE: Delete post 1
document.getElementById("deleteButton").onclick = async function() {

    try {

        message.innerText = "Sending DELETE request...";

        let response = await sendRequest(api + "/1", "DELETE");

        showResult(
            "DELETE successful! Status: " + response.status,
            response.data
        );

    } catch (error) {

        message.innerText = error.message;
        message.className = "error";

    }

};
