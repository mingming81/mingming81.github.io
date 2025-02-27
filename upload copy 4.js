document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submitBtn").addEventListener("click", uploadFile);
});

async function uploadFile() {
    let fileInput = document.getElementById("fileInput");
    let requestType = document.getElementById("requestType").value;
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
    formData.append("output_format", "pdf");  // Can be "docx" or "pdf"

    outputElement.innerText = "⏳ Uploading file... Please wait.";

    try {
        let response = await fetch("https://mingmingmyfastapi.duckdns.org:8000/upload/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        // ✅ Convert response to a downloadable file
        let blob = await response.blob();
        let url = window.URL.createObjectURL(blob);
        let downloadLink = document.createElement("a");

        let filename = response.headers.get("Content-Disposition")?.split("filename=")[1] || "generated_file.pdf";
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.innerText = "📥 Download File";
        downloadLink.setAttribute("target", "_blank");

        outputElement.innerText = "✅ File generated successfully!";
        outputElement.appendChild(document.createElement("br"));
        outputElement.appendChild(downloadLink);

    } catch (error) {
        outputElement.innerText = `❌ Error: ${error.message}`;
        console.error("Upload failed:", error);
    }
}
