document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitBtn").addEventListener("click", uploadFile);
});

async function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let requestType = document.getElementById("requestType").value;
    let outputFormat = document.getElementById("outputFormat").value; // Get selected format
    let outputElement = document.getElementById("output");

    if (!fileInput.files.length) {
        outputElement.innerText = "❌ Please select a file before submitting.";
        return;
    }

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("file", file);
    formData.append("request_type", requestType);
    formData.append("user_id", "github_user");
    formData.append("output_format", outputFormat); // Send selected format

    outputElement.innerText = "⏳ Uploading file... Please wait.";

    try {
        let response = await fetch("https://mingmingmyfastapi.duckdns.org:8000/upload/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        let blob = await response.blob();
        let url = window.URL.createObjectURL(blob);
        let downloadLink = document.createElement("a");

        let filename = `generated_file.${outputFormat}`;
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.innerText = `📥 Download ${filename}`;
        downloadLink.setAttribute("target", "_blank");

        outputElement.innerText = "✅ File generated successfully!";
        outputElement.appendChild(document.createElement("br"));
        outputElement.appendChild(downloadLink);
    } catch (error) {
        outputElement.innerText = `❌ Error: ${error.message}`;
        console.error("Upload failed:", error);
    }
}
