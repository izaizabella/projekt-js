document.addEventListener('DOMContentLoaded', () => {
    const cars = [
        {
            id: 1,
            price: 50000,
            image: 'https://cfm.pl/wp-content/uploads/2021/05/banner-cfm-podstrony-porady.jpg',
            brand: 'Toyota',
            year: 2020,
            model: 'Corolla',
            power: '150 KM',
            mileage: '30 000 km'
        },
        {
            id: 2,
            price: 60000,
            image: 'https://www.honda.pl/content/dam/central/cars/civic-hybrid/overview-v3/Honda-civic-hybrid-01-1x1-mobile.jpg/_jcr_content/renditions/m_r.jpg',
            brand: 'Honda',
            year: 2019,
            model: 'Civic',
            power: '170 KM',
            mileage: '40 000 km'
        },
        {
            id: 3,
            price: 55000,
            image: 'https://www.ford.pl/content/dam/guxeu/rhd/central/cars/2021-focus/launch/gallery/exterior/ford-focus-mca-c519-eu-STL_03_C519_Focus_Ext_Rear_3_4_Static-9x8-1200x1066_gt.jpg.renditions.original.png',
            brand: 'Ford',
            year: 2018,
            model: 'Focus',
            power: '160 KM',
            mileage: '50 000 km'
        },
        {
            id: 4,
            price: 65000,
            image: 'https://motopodprad.pl/wp-content/uploads/2018/10/2018-10-02-10_31_04-BMW-3-Series-2019-1024-01.jpg-Obraz-JPEG-1024-%C3%97-768-pikseli-Skala-91-1024x711.jpg',
            brand: 'BMW',
            year: 2021,
            model: '3 Series',
            power: '180 KM',
            mileage: '20 000 km'
        },
        {
            id: 5,
            price: 70000,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Uyis673Mh1UscTSdzRY6aml_0sJ602Apt4kyFe7enA&s',
            brand: 'Audi',
            year: 2020,
            model: 'A4',
            power: '190 KM',
            mileage: '25 000 km'
        },
        {
            id: 6,
            price: 80000,
            image: 'https://stimg.cardekho.com/images/carexteriorimages/930x620/Mercedes-Benz/S-Class/10853/1690451611932/front-left-side-47.jpg',
            brand: 'Mercedes',
            year: 2021,
            model: 'C-Class',
            power: '200 KM',
            mileage: '15 000 km'
        }
    ];

    const accessories = [
        { id: 1, name: 'Dywaniki', price: 100 },
        { id: 2, name: 'Pokrowce', price: 200 },
        { id: 3, name: 'System nawigacji', price: 1500 },
        { id: 4, name: 'Zestaw głośnomówiący', price: 300 },
        { id: 5, name: 'Kamera cofania', price: 500 }
    ];

    const carList = document.getElementById('car-list');
    const carConfig = document.getElementById('car-config');
    const configForm = document.getElementById('config-form');
    const deliveryDateSelect = document.getElementById('delivery-date');
    const accessoriesList = document.getElementById('accessories-list');
    const summarySection = document.getElementById('summary');
    const summaryMessage = document.getElementById('summary-message');
    const summaryImage = document.getElementById('summary-image');
    const errorMessage = document.getElementById('error-message');

    const saveDataToLocalStorage = (data) => {
        localStorage.setItem('carPurchaseData', JSON.stringify(data));
    };

    const loadDataFromLocalStorage = () => {
        const data = localStorage.getItem('carPurchaseData');
        return data ? JSON.parse(data) : null;
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('carPurchaseData');
    };

    const renderCars = (cars) => {
        carList.innerHTML = '';
        cars.forEach(car => {
            const carItem = document.createElement('div');
            carItem.className = 'car-item';
            carItem.innerHTML = `
                <img src="${car.image}" alt="${car.brand} ${car.model}">
                <h3>${car.brand} ${car.model}</h3>
                <p>Cena: ${car.price} PLN</p>
                <p>Rok: ${car.year}</p>
                <p>Moc: ${car.power}</p>
                <p>Przebieg: ${car.mileage}</p>
            `;
            carItem.addEventListener('click', () => showConfigForm(car));
            carList.appendChild(carItem);
        });
    };

    const showConfigForm = (car) => {
        carList.style.display = 'none';
        carConfig.style.display = 'block';
        configForm.reset();
        errorMessage.innerText = '';

        const today = new Date();
        deliveryDateSelect.innerHTML = '';
        for (let i = 1; i <= 14; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            const option = document.createElement('option');
            option.value = date.toISOString().split('T')[0];
            option.innerText = date.toISOString().split('T')[0];
            deliveryDateSelect.appendChild(option);
        }

        accessoriesList.innerHTML = '';
        accessories.forEach(accessory => {
            const accessoryItem = document.createElement('div');
            accessoryItem.innerHTML = `
                <input type="checkbox" id="accessory-${accessory.id}" value="${accessory.id}" data-price="${accessory.price}">
                <label for="accessory-${accessory.id}">${accessory.name} (${accessory.price} PLN)</label>
            `;
            accessoriesList.appendChild(accessoryItem);
        });

          configForm.dataset.carId = car.id;
    };

    const validateForm = () => {
        const name = document.getElementById('owner-name').value.trim();
        if (!name.includes(' ')) {
            errorMessage.innerText = 'Proszę podać pełne imię i nazwisko oddzielone spacją.';
            return false;
        }
        return true;
    };

    const handlePurchase = () => {
        if (!validateForm()) return;

        const carId = configForm.dataset.carId;
        const car = cars.find(c => c.id == carId);
        const financing = document.querySelector('input[name="financing"]:checked').value;
        const ownerName = document.getElementById('owner-name').value;
        const deliveryDate = document.getElementById('delivery-date').value;

        let totalPrice = car.price;
        const selectedAccessories= [];
        document.querySelectorAll('#accessories-list input:checked').forEach(accessory => {
            const accessoryId = accessory.value;
            const accessoryPrice = accessory.dataset.price;
            totalPrice += Number(accessoryPrice);
            selectedAccessories.push(accessories.find(a => a.id == accessoryId));
        });

        
        const dataToSave = {
            ownerName,
            deliveryDate,
            selectedAccessories: selectedAccessories.map(accessory => accessory.id)
        };
        saveDataToLocalStorage(dataToSave);

        summaryMessage.innerHTML = `
            <p>Dziękujemy za zakup, ${ownerName}!</p>
            <p>Wybrane auto: ${car.brand} ${car.model}</p>
            <p>Metoda płatności: ${financing}</p>
            <p>Data dostawy: ${deliveryDate}</p>
            <p>Cena całkowita: ${totalPrice} PLN</p>
        `;
        summaryImage.src = car.image;
        carConfig.style.display = 'none';
        summarySection.style.display = 'block';

       
        configForm.reset();

       
        clearLocalStorage();
    };

    document.getElementById('purchase-btn').addEventListener('click', handlePurchase);

    document.getElementById('back-btn').addEventListener('click', () => {
        carConfig.style.display = 'none';
        carList.style.display = 'block';
    });

    document.getElementById('search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredCars = cars.filter(car => car.brand.toLowerCase().includes(query));
        renderCars(filteredCars);
    });

   
    const savedData = loadDataFromLocalStorage();
    if (savedData) {
        document.getElementById('owner-name').value = savedData.ownerName;
        document.getElementById('delivery-date').value = savedData.deliveryDate;
        document.querySelectorAll('#accessories-list input').forEach(input => {
            if (savedData.selectedAccessories.includes(input.value)) {
                input.checked = true;
            }
        });
    }

    renderCars(cars);
});

