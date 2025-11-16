async function sendToAI(prompt) {
    const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    return data.reply;
}

async function sendMessage() {
    const input = document.getElementById("prompt");
    const output = document.getElementById("response");

    const prompt = input.value.trim();
    if (!prompt) return;

    output.innerHTML = "<p><i>Sedang memproses...</i></p>";

    const reply = await sendToAI(prompt);
    output.innerHTML = `<p>${reply}</p>`;
}
