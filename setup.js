document.getElementById("save").addEventListener("click", () => {
    chrome.storage.local.set({
      token: document.getElementById("token").value,
      username: document.getElementById("username").value,
      repo: document.getElementById("repo").value,
      defaultExt: document.getElementById("defaultExt").value
    }, () => {
      window.location.href = "popup.html";
    });
  });
  