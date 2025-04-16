// Bỏ chặn copy/paste
function addUserSelectCSS() {
  var cssSelectTextCSS = document.createElement("style");

  cssSelectTextCSS.type = "text/css";
  cssSelectTextCSS.innerText = `* {
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
           user-select: text !important;
      }`;
  document.head.appendChild(cssSelectTextCSS);
}

function enableCopy() {
  console.log("enable copy top called");
  addUserSelectCSS();
  var eventNameListArray = [
    "copy",
    "cut",
    "contextmenu",
    "mousedown",
    // "mouseup",
    "selectstart",
    "select",
    "paste",
    "keydown",
    "keyup",
    "drag",
    "dragstart",
  ];

  [].forEach.call(eventNameListArray, function (event) {
    document.addEventListener(
      event,
      function (e) {
        e.stopPropagation();
      },
      true
    );
  });

  var allElements = document.querySelectorAll("*");
  for (var index = 0; index < allElements.length; index++) {
    if (allElements[index].style.userSelect === "none") {
      allElements[index].style.userSelect = "auto";
    }
  }

  var injectScriptDisablePropagateEvent = document.createElement("script");
  injectScriptDisablePropagateEvent.type = "text/javascript";
  document.body.appendChild(injectScriptDisablePropagateEvent);

  injectScriptDisablePropagateEvent.innerHTML = `
          document.oncontextmenu = null;
          document.body.onpaste = null;
          document.body.onselectstart = null;
          document.onselectstart = null;
          document.ondragstart = null;
          document.body.oncut = null;
          document.onmousedown = null;
          document.body.oncontextmenu = null;
          document.body.oncopy = null;
          document.body.ondragstart = null;
          document.body.onmousedown = null;
      `;

  document.body.oncontextmenu = null;
  document.body.onmousedown = null;
  document.body.oncut = null;
  document.body.oncopy = null;
  document.body.onselectstart = null;
  document.body.ondragstart = null;
  document.body.onpaste = null;

  document.oncontextmenu = null;
  document.onmousedown = null;
  document.ondragstart = null;
  document.onselectstart = null;

  setTimeout(function () {
    document.oncontextmenu = null;
  }, 2000);

  var newEventNameList = ["select", "selectstart", "copy", "paste", "cut"];

  [].forEach.call(newEventNameList, function (event) {
    document.addEventListener(
      event,
      function (e) {
        e.stopPropagation();
      },
      true
    );
  });

  console.log("enable copy executed");
}

enableCopy();

function showToast(message) {
  //   console.log("show toast", message);
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "30px";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#323232";
  toast.style.color = "white";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = 10001;
  toast.style.opacity = 0.8;
  toast.style.fontSize = "14px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2500);
}

showToast("hello world");

function createCopyIcon(x, y, text) {
  // Xóa icon cũ nếu có
  const existing = document.getElementById("custom-copy-icon");
  if (existing) existing.remove();

  const icon = document.createElement("div");
  icon.id = "custom-copy-icon";
  icon.innerText = "📋";
  icon.style.position = "absolute";
  icon.style.top = `${y + 10}px`;
  icon.style.left = `${x + 10}px`;
  icon.style.cursor = "pointer";
  icon.style.background = "#fff";
  icon.style.border = "1px solid #ccc";
  icon.style.borderRadius = "6px";
  icon.style.padding = "2px 6px";
  icon.style.fontSize = "14px";
  icon.style.zIndex = 10000;
  icon.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  icon.style.userSelect = "none";

  icon.addEventListener("click", () => {
    const prompt = `giải thích bằng tiếng Việt: ${text}`;
    navigator.clipboard
      .writeText(prompt)
      .then(() => showToast("✅ Prompt đã được copy!"))
      .catch(() => showToast("❌ Không thể copy clipboard."));
    icon.remove();
  });

  document.body.appendChild(icon);
}

function registerSelect() {
  console.log("register select called");

  document.addEventListener("mouseup", (e) => {
    setTimeout(() => {
      const selectedText = window.getSelection().toString().trim();
      console.log("selectedText", selectedText);
      if (selectedText.length > 0) {
        const range = window.getSelection().getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = rect.right + window.scrollX;
        const y = rect.top + window.scrollY;
        createCopyIcon(x, y, selectedText);
      } else {
        const existing = document.getElementById("custom-copy-icon");
        if (existing) existing.remove();
      }
    }, 0);
  });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "copy_prompt") {
      const selectedText = window.getSelection().toString().trim();

      if (selectedText.length > 0) {
        const prompt = `giải thích bằng tiếng Việt: ${selectedText}`;
        navigator.clipboard
          .writeText(prompt)
          .then(() => showToast("✅ Prompt đã được copy!"))
          .catch(() => showToast("❌ Không thể copy clipboard."));
      } else {
        showToast("⚠️ Không có nội dung nào được chọn.");
      }

      console.log(`request: ${request.action}: ${selectedText}`);
    }
  });

  console.log("register select executed");
}

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log(`request2: ${request.action}`);
// });
setTimeout(() => {
  registerSelect();
}, 1000);
