
// 获取操作系统类型
function isMacOS() {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}
const closeButton = document.getElementById('close-button');
if (isMacOS()) {
    closeButton.classList.add('close-button-mac');
    //closeButton.classList.add('close-button-other');
} else {
    closeButton.classList.add('close-button-other');
    closeButton.classList.add('menuclose');
}