jQuery().ready(function () {
  const loginForm = jQuery('form#login');

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

      const vvcForm = jQuery('form#vvclogin');
      vvcForm[0].action = result.loginurl;
      vvcForm[0].access_token.value = result.jwt;
      vvcForm[0].logout.value = window.location.href;

      vvcForm.submit();
    })();
    return false;
  });
});