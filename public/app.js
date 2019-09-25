function loadVivocha(jwt) {
  jQuery('<vvc-ad-core></vvc-ad-core>')
    .attr('acct', "[accountid]")
    .attr('jwt', jwt)
    .attr('version', 1)
    .appendTo("body");

  jQuery('#app code').text(jwt)
}
jQuery().ready(function () {
  const loginView = jQuery('#login');
  const appView = jQuery('#app');
  const loginForm = jQuery('#login form');

  const vivochaJWT = Cookies.get('vivochaJWT');
  if (vivochaJWT) {
    loadVivocha(vivochaJWT);
    appView.show();
  } else {
    loginView.show();
  }
  loginForm.on('submit', function() {
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
      const vivochaJWT = result.jwt;
      const payload = JSON.parse(atob(vivochaJWT.split('.')[1]));

      Cookies.set('vivochaJWT', vivochaJWT, { expires: new Date(payload.exp * 1000) });
      loadVivocha(vivochaJWT);
      // hiding login form and showing the application
      loginView.hide();
      appView.show();
    })();
    return false;
  });
});