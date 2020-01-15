function loadVivocha(acct, jwt) {
  jQuery('<vvc-ad-core></vvc-ad-core>')
    .attr('acct', acct)
    .attr('jwt', jwt)
    .attr('version', 1)
    .appendTo("body");

  jQuery('#app code').text(jwt)
}
jQuery().ready(function () {
  const loginView = jQuery('#login');
  const appView = jQuery('#app');
  const loginForm = jQuery('#login form');

  const vivochaAcct = Cookies.get('vivochaAcct');
  const vivochaJWT = Cookies.get('vivochaJWT');
  if (vivochaJWT) {
    loadVivocha(vivochaAcct, vivochaJWT);
    appView.show();
  } else {
    loginView.show();
  }
  loginForm.on('submit', function() {
    (async function() {
      var formData = JSON.stringify({
        vvcuser: loginForm[0].vvcuser.value,
        vvcpass: loginForm[0].vvcpass.value,
        json: true
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
      const vivochaAcct = result.account;
      const vivochaJWT = result.jwt;
      const payload = JSON.parse(atob(vivochaJWT.split('.')[1]));

      Cookies.set('vivochaAcct', vivochaAcct, { expires: new Date(payload.exp * 1000) });
      Cookies.set('vivochaJWT', vivochaJWT, { expires: new Date(payload.exp * 1000) });
      loadVivocha(vivochaAcct, vivochaJWT);
      // hiding login form and showing the application
      loginView.hide();
      appView.show();
    })();
    return false;
  });
});