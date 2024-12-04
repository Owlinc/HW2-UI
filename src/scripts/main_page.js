import { getStudyInfo, editStudyInfo } from './api.js'

// Функция таймаута
function sleep(miliseconds) {
    var currentTime = new Date().getTime();
 
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
 }

// Функция для получения URL-параметра из строки
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Попыка получения параметра 'study_id'
const studyIdValue = getUrlParameter('study_id');

async function showPopUp(popupBack) {
    if (studyIdValue) {
        try {
            // Показываем поп-ап
            popupBack.style.display = 'flex';

            // Получаем данные для поп-апа
            const study_data = await getStudyInfo(studyIdValue);

            // Заполняем поп-ап
            let studyNameField = document.getElementById('study_name');
            studyNameField.value = study_data.study_name; 
            let studyDescField = document.getElementById('study_description');
            studyDescField.value = study_data.study_description; 

            // Логика кнопки "Сохранить" в поп-апе
            const saveButton = document.getElementById('popup_button_1');
            saveButton.addEventListener('click', function() {
                // Скрываем поп-ап
                popupBack.style.display = 'none';

                // Обновляем информацию на сервере
                let data_update = {
                    "study_name": studyNameField.value,
                    "study_description": studyDescField.value
                }
                editStudyInfo(studyIdValue, data_update)

                // Обновляем информацию в интерфейсе
                const component = document.getElementById('default_info');

                // Засыпаем на полсекунды, чтобы данные подргрузились на сервер
                sleep(150)
                fulfillMainPage(component)
            });

            // Логика кнопки "Отменить" в поп-апе
            const cancelButton = document.getElementById('popup_button_2');
            cancelButton.addEventListener('click', function() {
                popupBack.style.display = 'none';
    });
        } catch (error) {
            // Скрываем поп-ап
            popupBack.style.display = 'none';

            // Уведомляем об ошибке
            console.log('Error fetching study data:', error);
            alert("Ошибка! Исследование нельзя редактировать.")
        }
    }
}

// Функкция для заполнения страницы информацией об исследовании
async function fulfillMainPage(component) {

    if (studyIdValue) {
        try {

            // Извлекаем данные с сервера
            const study_data = await getStudyInfo(studyIdValue);
            console.log(study_data.study_name)
            component.innerHTML = `
                <span class="headline_1">Главное</span>

                <div class="content_section">
                    <span class="headline_2">Об исследовании</span>
                    <span class="content light secondary">
                        Название......................<span class="content primary">${study_data.study_name}</span>
                    </span>
                    <span class="content light secondary">
                        Описание......................<span class="content primary">${study_data.study_description}</span>
                    </span>
                    <span class="content light secondary">
                        Тип.................................<span class="content primary">${study_data.study_type}</span>
                    </span>
                </div>

                <div class="content_section">
                    <span class="headline_2">Прогресс</span>
                    <span class="content light secondary">
                        Статус...........................<span class="content primary active_text">${study_data.study_status}</span>
                    </span>
                    <span class="content light secondary">
                        Этап сбора....................<span class="content primary">${study_data.study_stage}</span>
                    </span>
                    <span class="content light secondary">
                        Участники......................<span class="content primary">${study_data.study_participants}</span>
                    </span>
                    <span class="content light secondary">
                        CR < 80%.......................<span class="content primary">${study_data.study_cr}</span>
                    </span>
                    <span class="content light secondary">
                        Средний CR...................<span class="content primary">${study_data.study_avg_cr}</span>
                    </span>
                </div>`;
        } catch (error) {
            console.log('Error fetching study data:', error);
            component.innerHTML = `
                <div class="content_section">
                    <span class="headline_1">Ошибка при загрузке данных!</span>
                    <span class="content light secondary">
                        Переданный параметр study_id не валиден. Попробуйте "pr215".
                    </span>
                </div>`;
        }
    } else {
        component.innerHTML = `
            <div class="content_section">
                <span class="headline_1">Ошибка!</span>
                <span class="content light secondary">
                    Параметр study_id не указан. Пример валидного study_id – pr215.
                </span>
            </div>`;
    }
}

// Подгрузка логики после загрзки страницы
window.addEventListener('DOMContentLoaded', () => {

    // Добавление блока с информацией про загрузку
    const component = document.createElement('div');
    component.id = "default_info";
    component.className = "page_content";
    component.innerHTML = `
    <div class="content_section">
        <span class="headline_1">Загрузка данных</span>
        <span class="content light secondary">
            Пожалуйста, подождите, данные загружаются...
        </span>
    </div>`;
    const main_container = document.getElementById("uc_1");
    main_container.appendChild(component);

    // Логика кнопки "Редактировать" в поп-апе
    const editButton = document.getElementById('edit_button');
    const popupBack = document.querySelector('.popup_back');
    editButton.addEventListener('click', function() {
        showPopUp(popupBack)
    });

    // Заполнение страницы данными с API
    fulfillMainPage(component);
});
