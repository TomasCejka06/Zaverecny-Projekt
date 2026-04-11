const API = "http://localhost:3000/api";
let user = JSON.parse(localStorage.getItem("user"));

async function loadPosts() {
    const res = await fetch(API + "/posts");
    const posts = await res.json();

    const container = document.getElementById("posts");
    container.innerHTML = "";

    posts.forEach(p => {
        container.innerHTML += `
            <div class="post">
                <h3>${p.title || ""}</h3>
                <p>${p.content}</p>
                <p><b>${p.firstname} ${p.lastname}</b></p>
                <button onclick="like(${p.id})">👍 Like</button>
            </div>
        `;
    });
}

async function addPost() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch(API + "/posts", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            title,
            content
        })
    });

    loadPosts();
}

async function like(post_id) {
    await fetch(API + "/like", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: user.id,
            post_id
        })
    });
}

loadPosts();