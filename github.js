chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === "pushToGitHub") {
      const { fileName, code, commitMsg, config } = request;
      const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${fileName}`;
      const content = btoa(unescape(encodeURIComponent(code)));
  
      fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": `token ${config.token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: commitMsg,
          content
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          chrome.runtime.sendMessage({ status: "success" });
        } else {
          chrome.runtime.sendMessage({ status: "error", error: data });
        }
      })
      .catch(error => {
        chrome.runtime.sendMessage({ status: "error", error });
      });
    }
  });
  