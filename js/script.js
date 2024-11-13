function createState() {
    let state = document.createElement('div');
    state.classList.add('state');
    state.innerHTML = `
    <div class="top">
        <div class="upload">
            <label for="image-upload" style="cursor: pointer;"><i class="fa-solid fa-upload icon"></i></label>
            <input type="file" id="image-upload" accept="image/*" onchange="initUpload(this.parentElement.parentElement)" style="display: none;">
        </div>
        <div class="webcam">
            <button type="button" onclick="initWebcam(this.parentElement.parentElement)"><i class="fa-solid fa-camera icon"></i></button>
        </div>
    </div>
    `;

    if (!document.getElementById('image-upload')) {
        document.getElementById('Cards').appendChild(state);
    }
}