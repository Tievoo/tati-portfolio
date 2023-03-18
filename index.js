window.onload = function() {

    const amountMap = {
        'naturaleza': 4,
        'retratos': 9,
        'fotoproducto': 2
    }

    createImageGrid(amountMap['retratos'], 'retratos')
    const imageModal = document.getElementById('image-modal');
    imageModal.addEventListener('click', (e) => {
        if(e.target.id !== 'modal-image') {
            imageModal.classList.remove('flex');
            imageModal.classList.add('hidden');    
        }
    })

    

    const buttons = document.querySelectorAll('.boton');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const selected = document.querySelector('.selected');
            selected.classList.remove('selected');
            const section = button.id;
            button.classList.add('selected')
            createImageGrid(amountMap[section], section);
        })
    });
}

function createImageGrid(amount, section) {
    const imageGrid = document.getElementById('image-grid');
    const imageModal = document.getElementById('image-modal');
    imageGrid.innerHTML = '';
    for (let i = 1; i <= amount; i++) {
        const image = document.createElement('img');
        image.src = `./assets/images/${section}/preview/${i}.png`;
        image.alt = `Imagen ${i}`;
        image.className = 'image-grid_image cursor-pointer'
        imageGrid.appendChild(image);
        image.addEventListener('click', () => {
            const imageSrc = image.src.replace('/preview', '');
            imageModal.lastElementChild.src = imageSrc;
            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');
        })
    }
}