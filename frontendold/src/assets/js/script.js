///////////////// 1 /////////////////
const el9 = document.getElementById("el9");
el9.addEventListener('click', () => changeColor(el9))

const el10 = document.querySelector("#el10");
el10.addEventListener('click', () => changeColor(el10));

function changeColor(element) {
    if (element) {
        element.style.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        element.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
}

///////////////// 2 /////////////////
const firstImage = document.querySelector(".image");
const images = [firstImage];

document.getElementById("addButton").addEventListener("click", () => {
    const image = document.createElement("img");
    image.src = "./images/san_francisco.jpg"
    image.alt = "Фото Сан-Франциско"
    image.style.maxWidth = "50%";
    firstImage.parentElement.appendChild(image);
    images.push(image);
});

document.getElementById("increaseButton").addEventListener("click", () => {
    const lastImage = images[images.length - 1];
    lastImage.width *= 1.1;
    lastImage.height *= 1.1;
})

document.getElementById("decreaseButton").addEventListener("click", () => {
    const lastImage = images[images.length - 1];
    console.log(images)
    lastImage.width *= 0.9;
    lastImage.height *= 0.9;
});

document.getElementById("deleteButton").addEventListener("click", () => {
    let lastImage = images.pop();
    lastImage.parentElement.removeChild(lastImage);
});

