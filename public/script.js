

const MODEL_URL = './models';
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
]);
// 이미지 업로드 이벤트 처리
document.getElementById('image-upload').addEventListener('change', async function (event) {
    const image = document.getElementById('uploaded-image');
    const faceOverlay = document.getElementById('face-overlay');

    // 이미지 불러오기
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    image.src = imageUrl;

    // 이미지 로드 후 얼굴 인식
    image.onload = async function () {
        const detectionResults = await faceapi.detectAllFaces(image).withFaceLandmarks();
        if (detectionResults) {
            const canvas = faceapi.createCanvasFromMedia(image);
            const dims = faceapi.matchDimensions(canvas, image);
            detectionResults.forEach((detectionResult) => {
                const faceRegion = detectionResult.detection.box;
                const x = faceRegion.x;
                const y = faceRegion.y;
                const width = faceRegion.width;
                const height = faceRegion.height;

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
                const croppedImageUrl = canvas.toDataURL('image/jpeg');
                const croppedImage = new Image();
                croppedImage.src = croppedImageUrl;
                document.body.append(croppedImage);
            });


        } else {
            faceOverlay.getContext('2d').clearRect(0, 0, dims.width, dims.height);
            faceapi.draw.drawDetections(faceOverlay, resizedResult);
            faceOverlay.style.top = `${image.offsetTop} px`;
            faceOverlay.style.left = `${image.offsetLeft} px`;
            faceOverlay.style.display = 'block';
        }
    };
});
