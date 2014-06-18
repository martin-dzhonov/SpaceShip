

var yesButton = document.getElementById('yesButton');
var yesButtonText = document.getElementById('yesButtonText');
var noButton = document.getElementById('noButton');
var noButtonText = document.getElementById('noButtonText');

//YES BUTTON EVENTS
yesButton.addEventListener('click', function () {
    location.reload(true);
});
yesButton.addEventListener('mouseover', function () {
    this.style.opacity = 1;
})
yesButton.addEventListener('mouseout', function () {
    this.style.opacity = 0.2;
})

//YES BUTTON TEXT EVENTS
yesButtonText.addEventListener('click', function () {
    location.reload(true);
})

//NO BUTTON EVENTS
noButton.addEventListener('click', function () {
    alert('This message should be replaced with a proper function about exiting the game!');
});
noButton.addEventListener('mouseover', function () {
    noButton.style.opacity = 0.6;
    noButtonText.style.opacity = 0.6;
})
noButton.addEventListener('mouseout', function () {
    noButton.style.opacity = 0.2;
    noButtonText.style.opacity = 0.2;
})

//NO BUTTON TEXT EVENTS
noButtonText.addEventListener('click', function () {
    alert('This message should be replaced with a proper function about exiting the game!');
})
noButtonText.addEventListener('mouseover', function () {
    noButton.style.opacity = 0.6;
    noButtonText.style.opacity = 0.6;
})
noButton.addEventListener('mouseout', function () {
    noButton.style.opacity = 0.2;
    noButtonText.style.opacity = 0.2;
})