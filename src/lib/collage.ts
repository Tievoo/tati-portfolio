
function updateCollageWidth() {
    const screenWidth = (window.innerWidth - window.innerWidth * 0.1);
    let imgAmount = 0;
    if (window.innerWidth >= 1280) imgAmount = 4;
    else imgAmount = 1;

    const HOR_WIDTH = 1126 * 0.8
    const VER_WIDTH = (HOR_WIDTH / 2)
    const HEIGHT = 752 * 0.8

    const IMG_CONTAINER = (screenWidth / imgAmount) - 12; // 24px is the gap between images
    const SCALE = IMG_CONTAINER / HOR_WIDTH;

    const collage = document.getElementById("collage");
    if (!collage) return;
    collage.style.width = `${screenWidth}px`;
    const images = collage.querySelectorAll("img");
    images.forEach((img) => {
        const orientation = img.dataset.orientation;
        img.style.width = `${(orientation === "hor" ? SCALE*HOR_WIDTH :  SCALE*VER_WIDTH - 6)}px`;
        img.style.height = `${HEIGHT * SCALE}px`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateCollageWidth();
    window.addEventListener("resize", updateCollageWidth);
});