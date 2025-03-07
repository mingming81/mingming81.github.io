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

    try {
        let response = await fetch("https://52.91.126.235:8000/upload/", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }

        let result = await response.json();

        // ✅ Display the generated content in the browser
        outputElement.innerText = `📄 Generated Content: \n\n${result.generated_content}`;

        // ✅ Provide a file download link
        let downloadLink = document.createElement("a");
        downloadLink.href = result.file_url;
        downloadLink.innerText = "📥 Download File";
        downloadLink.setAttribute("target", "_blank");

        outputElement.appendChild(document.createElement("br"));
        outputElement.appendChild(downloadLink);

    } catch (error) {
        outputElement.innerText = `❌ Error: ${error.message}`;
        console.error("Upload failed:", error);
    }
}

