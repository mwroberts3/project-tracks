// Toggle new-idea popup
document.getElementById('add-new-idea-btn').addEventListener('click', () => {
    document.querySelector('.popup-overlay').classList.remove('hidden');
})

document.querySelector('.popup-overlay').addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-overlay')) {
        document.querySelector('.popup-overlay').classList.add('hidden');
    }
})

// add custom field button
const customFieldCont = document.querySelector('.custom-field-container');
document.querySelector('.add-custom-field').addEventListener('click', () => {
    let newCustomField = document.createElement('div');

    newCustomField.innerHTML += `
    <label for="custom-field-name">Custom Field Name</label>
    <input type="text" name="custom-field-title" class="center-x"></input>
    <label for="custom-field-content">Content (HTML)</label>
    <textarea name="custom-field-content" cols="30" rows="10"> </textarea>
    `

    customFieldCont.appendChild(newCustomField);
})