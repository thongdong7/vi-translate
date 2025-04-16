// Bỏ chặn copy/paste
document.addEventListener("copy", (e) => e.stopImmediatePropagation(), true);
document.addEventListener("cut", (e) => e.stopImmediatePropagation(), true);
document.addEventListener("paste", (e) => e.stopImmediatePropagation(), true);

// Tạo nút icon nổi
const icon = document.createElement("img");
icon.src = chrome.runtime.getURL("icon.png");
icon.style.position = "absolute";
icon.style.width = "24px";
icon.style.height = "24px";
icon.style.cursor = "pointer";
icon.style.zIndex = 10000;
icon.style.display = "none";
document.body.appendChild(icon);

// Lưu text được chọn
let selectedText = "";

document.addEventListener("mouseup", (e) => {
  const text = window.getSelection().toString().trim();
  if (text.length > 0) {
    selectedText = text;
    const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    icon.style.top = `${window.scrollY + rect.top - 30}px`;
    icon.style.left = `${window.scrollX + rect.left}px`;
    icon.style.display = "block";
  } else {
    icon.style.display = "none";
  }
});

// Xử lý khi click vào icon
icon.addEventListener("click", async () => {
  const prompt = `giải thích bằng tiếng Việt: ${selectedText}`;
  try {
    await navigator.clipboard.writeText(prompt);
    alert("Đã copy prompt vào clipboard!");
  } catch (err) {
    console.error("Lỗi khi copy:", err);
  }
  icon.style.display = "none";
});
