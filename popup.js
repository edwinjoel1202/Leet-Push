chrome.storage.local.get(["token", "username", "repo", "defaultExt"], (config) => {
    if (!config.token || !config.username || !config.repo) {
      window.location.href = "setup.html";
      return;
    }
  
    if (config.defaultExt) {
      document.getElementById("fileType").value = config.defaultExt;
    }
  
    document.getElementById("push").addEventListener("click", () => {
      const commitMsg = document.getElementById("commitMsg").value.trim();
      const code = document.getElementById("code").value.trim();
      const ext = document.getElementById("fileType").value;
  
      if (!commitMsg || !code) {
        alert("❗ Commit message and code cannot be empty.");
        return;
      }
  
      const fileName = `leetcode_${Date.now()}${ext}`;
  
      if (document.getElementById("setDefault").checked) {
        chrome.storage.local.set({ defaultExt: ext });
      }
  
      chrome.runtime.sendMessage({
        action: "pushToGitHub",
        fileName,
        code,
        commitMsg,
        config
      });
    });
  });
  
  // Listen for response from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.status === "success") {
      alert("Code pushed successfully to GitHub !");
    } else if (message.status === "error") {
      alert("Push failed. Check your GitHub token, repo, or network.");
      console.error(message.error);
    }
  });
  