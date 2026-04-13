const API = "http://localhost:3000/api";
let user = JSON.parse(localStorage.getItem("user"));

async function loadPosts() {
    const res = await fetch(API + "/posts");
    const posts = await res.json();

    const container = document.getElementById("posts");
    container.innerHTML = "";

    for (let p of posts) {
        const commentsRes = await fetch(API + "/comments/" + p.id);
        const comments = await commentsRes.json();

        container.innerHTML += `
        <div class="post">
            <h3 contenteditable="${p.user_id === user.id}" 
                onblur="editPost(${p.id}, this.innerText, '${p.content}')">
                ${p.title || ""}
            </h3>

            <p contenteditable="${p.user_id === user.id}" 
               onblur="editPost(${p.id}, '${p.title}', this.innerText)">
               ${p.content}
            </p>

            <p><b>${p.firstname} ${p.lastname}</b></p>

            <button onclick="like(${p.id})">👍 ${p.likes}</button>

            ${p.user_id === user.id ? 
                `<button onclick="deletePost(${p.id})">🗑</button>` 
                : ""
            }

            <div>
                ${comments.map(c => `<p><b>${c.firstname}:</b> ${c.content}</p>`).join("")}
                <input placeholder="Komentář..." id="c${p.id}">
                <button onclick="addComment(${p.id})">💬</button>
            </div>
        </div>
        `;
    }
}

// ADD POST
async function addPost() {
    await fetch(API + "/posts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            title: title.value,
            content: content.value
        })
    });

    loadPosts();
}

// DELETE
async function deletePost(id) {
    await fetch(API + "/posts/" + id, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ user_id: user.id })
    });

    loadPosts();
}

// EDIT
async function editPost(id, title, content) {
    await fetch(API + "/posts/" + id, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            title,
            content
        })
    });
}

// LIKE
async function like(post_id) {
    await fetch(API + "/like", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            post_id
        })
    });

    loadPosts();
}

// COMMENT
async function addComment(post_id) {
    const input = document.getElementById("c" + post_id);

    await fetch(API + "/comments", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            post_id,
            content: input.value
        })
    });

    loadPosts();
}

loadPosts();