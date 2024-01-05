const start_button = document.getElementById('start');
const reset_button = document.getElementById('reset');


start_button.addEventListener('click', (event) => {
    tile5_div.dataset.state = "active";
});
reset_button.addEventListener('click', (event) => {
    console.log(event);
});