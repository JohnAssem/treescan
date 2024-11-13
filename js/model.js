const URL = "model/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

async function initWebcam(card) {
    await init();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip); // Width, height, flip
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(() => webcamLoop(card));
}

async function webcamLoop(card) {
    webcam.update(); // Update the webcam frame
    await predict(webcam.canvas, null, card); // null for imgSrc, since it’s from the webcam
    window.requestAnimationFrame(() => webcamLoop(card));
}


async function initUpload(card) {
    await init();
    const imageUpload = document.getElementById("image-upload");
    handleImageUpload(imageUpload.files[0], card);
}

async function handleImageUpload(file, card) {
    if (file) {
        const img = new Image();
        img.src = window.URL.createObjectURL(file);

        img.onload = async () => {
            await predict(img, img.src, card);
            window.URL.revokeObjectURL(img.src);
        };
    }
}

async function predict(src, imgSrc, card) {
    const predictions = await model.predict(src);

    // Sort predictions by probability from max to min
    predictions.sort((a, b) => b.probability - a.probability);

    // Generate HTML for all predictions with a custom display name if needed
    let predictionsHTML = predictions.map(prediction => {
        // Rename specific classes
        let displayName = prediction.className;
        if (displayName === 'cornCercosporaLeafSpot_grayLeafSpot') {
            displayName = 'grayLeafSpot';
        }

        const classColor = displayName.includes('healthy') || displayName === 'healthy' ? 'good-state' : 'bad-state';
        return `
            <div class="prediction">
                <span class="${classColor}">${displayName}</span>: 
                <span>${(prediction.probability * 100).toFixed(2)}%</span>
            </div>
        `;
    }).join('');

    // Set image source if it's from the webcam, capture a static frame
    if (!imgSrc) {
        const webcamImage = webcam.canvas.toDataURL("image/png");
        imgSrc = webcamImage;
    }

    // Update the card's content with the new structure
    card.innerHTML = `
        <img src="${imgSrc}" alt="Captured Image" style="width: 300px;">
        <div class="data">
            ${predictionsHTML}
        </div>
    `;
    createState();
}