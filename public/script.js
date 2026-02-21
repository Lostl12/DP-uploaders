const uploadBtn = document.getElementById("uploadBtn");
const statusDiv = document.getElementById("status");

uploadBtn.addEventListener("click", async () => {
  const number = document.getElementById("number").value;
  const photo = document.getElementById("photo").files[0];

  if (!number || !photo) {
    statusDiv.textContent = "Enter number and select image!";
    return;
  }

  const formData = new FormData();
  formData.append("number", number);
  formData.append("photo", photo);

  statusDiv.textContent = "Uploading...";

  const res = await fetch("/upload", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  if (data.ok) {
    statusDiv.textContent = "Uploaded successfully! WhatsApp will get it.";
  } else {
    statusDiv.textContent = "Error: " + (data.msg || "Unknown error");
  }
});
