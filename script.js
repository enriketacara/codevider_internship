async function fetchData(apiUrl, type) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        createCards(data, type);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function createCards(animals, type) {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // Clear previous cards

    animals.forEach(animal => {
        // Create card elements
        const card = document.createElement('div');
        card.className = 'card';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'img-container';

        const imgInner = document.createElement('div');
        imgInner.className = 'img-inner';

        const img = document.createElement('img');
        img.src = animal.image; // Use the animal's image URL

        imgInner.appendChild(img);
        imgContainer.appendChild(imgInner);

        const textContainer = document.createElement('div');
        textContainer.className = 'text-container';

        const title = document.createElement('h3');
        title.textContent = animal.name; // Use the animal's name

        const description = document.createElement('div');
        description.textContent = animal.origin || animal.place_of_found; // Use origin or place of found

        textContainer.appendChild(title);
        textContainer.appendChild(description);

        card.appendChild(imgContainer);
        card.appendChild(textContainer);

        // Add click event to show details in SweetAlert
        card.addEventListener('click', () => showDetails(animal, type));

        container.appendChild(card);
    });
}

function showDetails(animal, type) {
    let details = '';

    switch (type) {
        case 'Birds':
            details = `
                <strong>Species:</strong> ${animal.species}<br>
                <strong>Family:</strong> ${animal.family}<br>
                <strong>Habitat:</strong> ${animal.habitat}<br>
                <strong>Place of Found:</strong> ${animal.place_of_found}<br>
                <strong>Diet:</strong> ${animal.diet}<br>
                <strong>Description:</strong> ${animal.description}<br>
                <strong>Weight:</strong> ${animal.weight_kg} kg<br>
                <strong>Height:</strong> ${animal.wingspan_cm} cm
            `;
            break;
        case 'Dogs':
            details = `
                <strong>Breed Group:</strong> ${animal.breed_group}<br>
                <strong>Size:</strong> ${animal.size}<br>
                <strong>Lifespan:</strong> ${animal.lifespan}<br>
                <strong>Origin:</strong> ${animal.origin}<br>
                <strong>Temperament:</strong> ${animal.temperament}<br>
                <strong>Colors:</strong> ${animal.colors.join(', ')}
            `;
            break;
        case 'Cats':
            details = `
                <strong>Name:</strong> ${animal.name}<br>
                <strong>Origin:</strong> ${animal.origin}<br>
                <strong>Temperament:</strong> ${animal.temperament}<br>
                <strong>Description:</strong> ${animal.description}<br>
                <strong>Colors:</strong> ${animal.colors.join(', ')}
            `;
            break;
    }

    Swal.fire({
        title: animal.name,
        html: details,
        imageUrl: animal.image,
        imageWidth: 320,
        imageHeight: 200,
        imageAlt: animal.name,
        customClass: {
            container: 'custom-swal-container',
            title: 'custom-swal-title',
            htmlContainer: 'custom-swal-html-container',
            image: 'custom-swal-image'
        },
        showCloseButton: true,
        showConfirmButton: false
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const pageType = document.body.getAttribute('data-page-type');

    switch (pageType) {
        case 'birds':
            fetchData('https://freetestapi.com/api/v1/birds', 'Birds');
            break;
        case 'dogs':
            fetchData('https://freetestapi.com/api/v1/dogs', 'Dogs');
            break;
        case 'cats':
            fetchData('https://freetestapi.com/api/v1/cats', 'Cats');
            break;
        default:
            console.error('Unknown page type:', pageType);
    }

    const searchInput = document.querySelector('.srch');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (query !== '') {
            let apiUrl = '';
            switch (pageType) {
                case 'birds':
                    apiUrl = `https://freetestapi.com/api/v1/birds?search=${query}`;
                    break;
                case 'dogs':
                    apiUrl = `https://freetestapi.com/api/v1/dogs?search=${query}`;
                    break;
                case 'cats':
                    apiUrl = `https://freetestapi.com/api/v1/cats?search=${query}`;
                    break;
                default:
                    console.error('Unknown page type:', pageType);
                    return;
            }
            fetchData(apiUrl, pageType);
        } else {
            // If the search input is empty, fetch all animals again
            switch (pageType) {
                case 'birds':
                    fetchData('https://freetestapi.com/api/v1/birds', 'Birds');
                    break;
                case 'dogs':
                    fetchData('https://freetestapi.com/api/v1/dogs', 'Dogs');
                    break;
                case 'cats':
                    fetchData('https://freetestapi.com/api/v1/cats', 'Cats');
                    break;
                default:
                    console.error('Unknown page type:', pageType);
            }
        }
    });
});
