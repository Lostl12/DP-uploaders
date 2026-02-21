const uploadBtn = document.getElementById("uploadBtn");
const statusDiv = document.getElementById("status");
const qrCanvas = document.getElementById("qrCanvas");

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

  statusDiv.textContent = "Generating QR code, scan with WhatsApp on your phone...";

  const res = await fetch("/start-session", { method: "POST", body: formData });
  const data = await res.json();

  if (data.ok && data.qr) {
    statusDiv.textContent = "Scan QR on your phone to complete linking!";
    import('qrcode').then(QRCode => QRCode.toCanvas(qrCanvas, data.qr));
  } else {
    statusDiv.textContent = "Error: " + (data.msg || "Unknown error");
  }
});
