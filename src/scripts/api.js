// Функция для получения информации об исследовании
export const getStudyInfo = async (studyId) => {
    const response = await fetch(`https://d5dimfn9q98ur9skbrh9.apigw.yandexcloud.net/get_study/${studyId}`)

    if (!response.ok) {
        throw new Error((response.status));
    }

    const data = await response.json();

    return data
}

// Функция для редактирования информации об исследовании
export const editStudyInfo = async (studyId, update_data) => {
    const response = await fetch(`https://d5dimfn9q98ur9skbrh9.apigw.yandexcloud.net/edit_study/${studyId}`, {
        method: 'PATCH',
        body: JSON.stringify(update_data),
        headers: {
            'Access-Control-Allow-Origin': "*",
            'Access-Control-Allow-Methods': "*",
            'Content-type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error((response.status));
    }

    const data = await response.json();
    return data
}