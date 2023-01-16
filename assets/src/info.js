var userInfo = JSON.parse(localStorage.getItem('user'));
var userDetail = document.getElementById('information');
userDetail.style.position = 'absolute';
userDetail.style.zIndex = 1;
userDetail.classList.add('pe-0');
userDetail.classList.add('text-center');
userDetail.style.top = "10px";
userDetail.innerHTML = `
<h4 class="text-white fs-6 mt-0 mb-2">
<img src="${userInfo.photoURL}" width="40px" height="40px"  class="user-img"></img>
${userInfo.displayName}</h4>`
