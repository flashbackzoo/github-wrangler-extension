(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var oauthToken = document.getElementById('oauth-token'),
            status = document.getElementById('status'),
            saveButton = document.getElementById('save-button');

        chrome.storage.sync.get('oauthToken', function (storage) {
            oauthToken.value = storage.oauthToken || '';
        });

        saveButton.addEventListener('click', function () {
            var value = oauthToken.value;

            setTimeout(function () {
                status.textContent = '';
            }, 2000);

            if (!value) {
                status.textContent = 'You need to specify a value.';
                return;
            }

            chrome.storage.sync.set({ oauthToken: value }, function() {
                status.textContent = 'Settings saved';
            });
        });
    });
}());
