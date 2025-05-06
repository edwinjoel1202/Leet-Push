document.addEventListener('DOMContentLoaded', () => {
  const pushBtn = document.getElementById('push');
  const spinner = document.getElementById('spinner');
  const clearConfig = document.getElementById('clearConfig');

  chrome.storage.local.get(['token', 'username', 'repo', 'defaultExt'], config => {
    if (!config.token || !config.username || !config.repo) {
      window.location.href = 'setup.html';
    }

    if (config.defaultExt) {
      document.getElementById('fileType').value = config.defaultExt;
    }
  });

  clearConfig.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear GitHub configuration?')) {
      chrome.storage.local.clear(() => window.close());
    }
  });

  pushBtn.addEventListener('click', () => {
    const commitMsg = document.getElementById('commitMsg').value.trim();
    const code = document.getElementById('code').value.trim();
    const fileType = document.getElementById('fileType').value;
    const setDefault = document.getElementById('setDefault').checked;

    if (!commitMsg || !code) {
      alert('Please enter commit message and code.');
      return;
    }

    pushBtn.disabled = true;
    spinner.style.display = 'inline-block';

    chrome.storage.local.get(['token', 'username', 'repo'], config => {
      const fileName = `leetcode_${Date.now()}${fileType}`;
      const content = btoa(unescape(encodeURIComponent(code)));

      fetch(`https://api.github.com/repos/${config.username}/${config.repo}/contents/${fileName}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${config.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: commitMsg,
          content: content
        })
      })
      .then(res => res.json())
      .then(() => {
        if (setDefault) {
          chrome.storage.local.set({ defaultExt: fileType });
        }

        alert('✅ Code pushed to GitHub successfully!');

        document.getElementById('commitMsg').value = '';
        document.getElementById('code').value = '';
        document.getElementById('setDefault').checked = false;

        spinner.style.display = 'none';
        pushBtn.disabled = false;
      })
      .catch(err => {
        alert('❌ Failed to push code: ' + err.message);
        spinner.style.display = 'none';
        pushBtn.disabled = false;
      });
    });
  });
});
