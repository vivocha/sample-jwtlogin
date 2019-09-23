jQuery().ready(function () {
  const loginView = jQuery('#login');
  const appView = jQuery('#app');

  const loginForm = jQuery('#login form');
  loginView.show();
  jQuery('#login form')
    .on('submit', function() {
      (async function() {
        var formData = JSON.stringify({
          vvcuser: loginForm[0].vvcuser.value,
          vvcpass: loginForm[0].vvcpass.value
        });
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: formData
        });
        const result = await response.json();
        console.log(result);
        jQuery('<vvc-ad-core acct="[accountid]" version="1" jwt="' + result.jwt + '" ></vvc-ad-core>').appendTo("body");

        // hiding login form and showing the application
        loginForm.hide();
        appView.show();
      })();
      return false;
    });
});