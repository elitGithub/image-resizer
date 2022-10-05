const form = document.getElementById('img-form');
const img = document.getElementById('img');
const outputPath = document.getElementById('output-path');
const filename = document.getElementById('filename');
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');

function loadImage(e) {
    const file = e.target.files[0];
    if (!isFileImage(file)) {
        alertError('bad image file');
        return;
    }

    //Get original dimensions

    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width;
        heightInput.value = this.height;
    };

    form.style.display = 'block';
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homedir(), 'imageresizer');
}

function sendImage(e) {
    e.preventDefault();
    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    if (!img.files[0]) {
        alertError('Please upload an image');
        return;
    }

    if (width === '' || height === '') {
        alertError('Please specify height and width');
        return;
    }

    // Send to main using ipcRenderer
    ipcRenderer.send('image:resize', { imgPath, width, height });

}

// Response to done event
ipcRenderer.on('image:done', () => {
    alertSuccess(`Image resized successfully to ${ widthInput.value } * ${ heightInput.value }.`)
});

// Image validator
function isFileImage(file) {
    const acceptedImageTypes = [
        'image/gif',
        'image/png',
        'image/jpeg',
        'image/jpg',
    ];

    return file && acceptedImageTypes.includes(file['type']);
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center'
        }
    })
}

function alertSuccess(message) {
    Toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center'
        }
    })
}


img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage);
