window.onload = function() {

    const amountMap = {
        'naturaleza': 4,
        'retratos': 9,
        'fotoproducto': 2,
        'ba': 3
    }

    const beforeAfter = document.getElementById('before-after');
    const portfolio = document.getElementById('portfolio');
    const contact = document.getElementById('contact');

    createImageGrid(amountMap['retratos'], 'retratos')
    createBeforeAfterGrid()
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

    const toBeforeAfter = document.getElementById('to-before-after');
    toBeforeAfter.addEventListener('click', () => {
        if(beforeAfter.classList.contains('hidden')) {
            beforeAfter.classList.remove('hidden');
            beforeAfter.classList.add('flex');
            portfolio.classList.remove('flex');
            portfolio.classList.add('hidden');
        }
    })

    const toPortfolio = document.getElementById('to-portfolio');
    toPortfolio.addEventListener('click', () => {
        if(portfolio.classList.contains('hidden')) {
            portfolio.classList.remove('hidden');
            portfolio.classList.add('flex');
            beforeAfter.classList.remove('flex');
            beforeAfter.classList.add('hidden');
        }
    })

    const toPortfolio2 = document.getElementById('to-portfolio-2');
    toPortfolio2.addEventListener('click', () => {
        if(portfolio.classList.contains('hidden')) {
            portfolio.classList.remove('hidden');
            portfolio.classList.add('flex');
            beforeAfter.classList.remove('flex');
            beforeAfter.classList.add('hidden');
        }
    })

    const toContact = document.getElementById('to-contact');
    toContact.addEventListener('click', () => {
        contact.scrollIntoView({behavior: 'smooth'});
    })
}

function createBeforeAfterGrid() {
    const AMOUNT = 3;
    const baGrid = document.getElementById('ba-grid');
    const imageModal = document.getElementById('image-modal');
    baGrid.innerHTML = '';
    for (let i = 1; i <= AMOUNT; i++) {
        const before = document.createElement('img');
        const after = document.createElement('img');
        before.src = `./assets/images/beforeafter/b${i}.png`;
        after.src = `./assets/images/beforeafter/a${i}.png`;
        before.alt = `Imagen before ${i}`;
        after.alt = `Imagen after ${i}`;
        before.className = 'ba-grid_image cursor-pointer'
        after.className = 'ba-grid_image cursor-pointer'
        
        before.addEventListener('click', () => {
            const imageSrc = before.src;
            imageModal.lastElementChild.src = imageSrc;
            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');
        })
        after.addEventListener('click', () => {
            const imageSrc = after.src;
            imageModal.lastElementChild.src = imageSrc;
            imageModal.classList.remove('hidden');
            imageModal.classList.add('flex');
        })
        baGrid.appendChild(before);
        baGrid.appendChild(after);
    }
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