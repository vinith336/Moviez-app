$(document).ready(function () {
    AOS.init()
    $('.spinner-wrapper').fadeOut(500)
    $('.toast').toast('show');
})

async function logout() {
  const url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/users/logout`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: "same-origin",
})
  if (response.status == 200) {
    window.location.href=`${window.location.protocol}//${window.location.hostname}:${window.location.port}?toastMessage=Logged out sucessfully`
  } else {
    console.log('failed')
  }
}