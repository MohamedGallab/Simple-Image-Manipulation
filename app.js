
//Displays the original image after being uploaded
function displayOriginalImage(event) {
	if (event.files.length != 0) {
		if (checkFileName(event.files[0].name)) {
			document.getElementById("inputImage").src = window.URL.createObjectURL(event.files[0]);
			document.getElementById("originalImage").style.display = "initial";
			document.getElementById("transformation").style.display = "initial";
			document.getElementById("result").style.display = "none";
		}
	}
}

//Makes sure the uploaded file is a png or jpg image 
function checkFileName(fileName) {
	if (fileName == "") {
		alert("Browse to upload a valid File with png or jpg extension");
		return false;
	}
	else if (fileName.split(".")[1].toUpperCase() == "PNG" || fileName.split(".")[1].toUpperCase() == "JPG")
		return true;
	else {
		alert("File with " + fileName.split(".")[1] + " is invalid. Upload a valid file with png or jpg extensions");
		return false;
	}
}

//Displays the corresponding form to the selected transformation and hides the other forms
function showTransformForm() {

	const mylist = document.getElementById("myList");

	//Storing the type chosen in a variable
	let transformType = mylist.options[mylist.selectedIndex].text;

	//Displaying to the user the type he chose by changing the text element of id= transformType to the selected type
	document.getElementById("transformType").innerHTML = mylist.options[mylist.selectedIndex].text;

	if (transformType == "Increase Brightness") {
		document.getElementById("increaseBrightnessInputs").style.display = "initial";
		document.getElementById("decreaseBrightnessInputs").style.display = "none";
		document.getElementById("increaseContrastInputs").style.display = "none";
		document.getElementById("decreaseContrastInputs").style.display = "none";
		document.getElementById("inverseInputs").style.display = "none";

	}
	else if (transformType == "Decrease Brightness") {
		document.getElementById("increaseBrightnessInputs").style.display = "none";
		document.getElementById("decreaseBrightnessInputs").style.display = "initial";
		document.getElementById("increaseContrastInputs").style.display = "none";
		document.getElementById("decreaseContrastInputs").style.display = "none";
		document.getElementById("inverseInputs").style.display = "none";
	}
	else if (transformType == "Increase Contrast") {
		document.getElementById("increaseBrightnessInputs").style.display = "none";
		document.getElementById("decreaseBrightnessInputs").style.display = "none";
		document.getElementById("increaseContrastInputs").style.display = "initial";
		document.getElementById("decreaseContrastInputs").style.display = "none";
		document.getElementById("inverseInputs").style.display = "none";
	}
	else if (transformType == "Decrease Contrast") {
		document.getElementById("increaseBrightnessInputs").style.display = "none";
		document.getElementById("decreaseBrightnessInputs").style.display = "none";
		document.getElementById("increaseContrastInputs").style.display = "none";
		document.getElementById("decreaseContrastInputs").style.display = "initial";
		document.getElementById("inverseInputs").style.display = "none";
	}
	else {
		document.getElementById("increaseBrightnessInputs").style.display = "none";
		document.getElementById("decreaseBrightnessInputs").style.display = "none";
		document.getElementById("increaseContrastInputs").style.display = "none";
		document.getElementById("decreaseContrastInputs").style.display = "none";
		document.getElementById("inverseInputs").style.display = "initial";
	}
}

// forms' Event Listeners
document.getElementById("increaseBrightnessForm").addEventListener("submit", (e) => {
	e.preventDefault();
	var ib = document.getElementById("ib").value;
	increaseBrightness(Number(ib));
});

document.getElementById("decreaseBrightnessForm").addEventListener("submit", (e) => {
	e.preventDefault();
	var db = document.getElementById("db").value;
	decreaseBrightness(Number(db));
});

document.getElementById("increaseContrastForm").addEventListener("submit", (e) => {
	e.preventDefault()
	var originalBrightestDarkInput = document.getElementById("originalBrightestDarkIncreaseContrast").value;
	var originalDarkestBrightInput = document.getElementById("originalDarkestBrightIncreaseContrast").value;
	var transformedBrightestDarkInput = document.getElementById("transformedBrightestDarkIncreaseContrast").value;
	var transformedDarkestBrightInput = document.getElementById("transformedDarkestBrightIncreaseContrast").value;
	changeContrast(Number(originalBrightestDarkInput), Number(originalDarkestBrightInput), Number(transformedBrightestDarkInput), Number(transformedDarkestBrightInput));
});

document.getElementById("decreaseContrastForm").addEventListener("submit", (e) => {
	e.preventDefault()
	var originalBrightestDarkInput = document.getElementById("originalBrightestDark").value;
	var originalDarkestBrightInput = document.getElementById("originalDarkestBright").value;
	var transformedBrightestDarkInput = document.getElementById("transformedBrightestDark").value;
	var transformedDarkestBrightInput = document.getElementById("transformedDarkestBright").value;
	changeContrast(Number(originalBrightestDarkInput), Number(originalDarkestBrightInput), Number(transformedBrightestDarkInput), Number(transformedDarkestBrightInput));
});

document.getElementById("inverseForm").addEventListener("submit", (e) => {
	e.preventDefault();
	inverse();
});

//Applies pixel-wise transformations to increase brightness
function increaseBrightness(ib) {
	const img = document.getElementById("inputImage");
	const canvas = document.getElementById("resultImage");
	const ctx = canvas.getContext('2d');

	var transformedImage = [];
	var val;

	//Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
	let rgba = getRGBAValues(img, canvas, ctx);

	for (i = 0; i < img.width * img.height * 4; i += 4) {
		val = rgba[i] + ib;
		if (val > 255) {
			val = 255;
		}
		transformedImage.push(val, val, val, rgba[i + 3]);
	}

	displayResultImage(img, transformedImage, ctx);

}

//Applies pixel-wise transformations to decrease brightness
function decreaseBrightness(db) {
	const img = document.getElementById("inputImage");
	const canvas = document.getElementById("resultImage");
	const ctx = canvas.getContext('2d');

	var transformedImage = [];
	var val;

	//Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
	rgba = getRGBAValues(img, canvas, ctx);

	for (i = 0; i < img.width * img.height * 4; i += 4) {
		val = rgba[i] - db;
		if (val < 0) {
			val = 0;
		}
		transformedImage.push(val, val, val, rgba[i + 3]);
	}

	displayResultImage(img, transformedImage, ctx);
}

//Applies pixel-wise transformations to increase contrast
function changeContrast(originalBrightestDark, originalDarkestBright, transformedBrightestDark, transformedDarkestBright) {
	const img = document.getElementById("inputImage");
	const canvas = document.getElementById("resultImage");
	const ctx = canvas.getContext('2d');

	var transformedImage = [];
	var val;

	//Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
	rgba = getRGBAValues(img, canvas, ctx);

	for (i = 0; i < img.width * img.height * 4; i += 4) {

		if (rgba[i] <= originalBrightestDark) {
			// If the pixel in the dark area.
			let darkSlope = transformedBrightestDark / originalBrightestDark;
			val = darkSlope * rgba[i];
		}
		else if (rgba[i] <= originalDarkestBright) {
			// If the pixel in the middle area.
			let middleSlope = (transformedDarkestBright - transformedBrightestDark) / (originalDarkestBright - originalBrightestDark);
			val = middleSlope * (rgba[i] - originalBrightestDark) + transformedBrightestDark;
		}
		else {
			// If the pixel in the light area.
			let brightSlope = (255 - transformedDarkestBright) / (255 - originalDarkestBright);
			val = brightSlope * (rgba[i] - 255) + 255;
		}

		transformedImage.push(val, val, val, rgba[i + 3]);
	}

	displayResultImage(img, transformedImage, ctx);

}

//Applies pixel-wise transformations to inverse image
function inverse() {
	const img = document.getElementById("inputImage");
	const canvas = document.getElementById("resultImage");
	const ctx = canvas.getContext('2d');

	let transformedImage = [];
	let val;

	//Images are displayed in the RGBA format so a greyscale pixel could look like (25,25,25,255)
	let rgba = getRGBAValues(img, canvas, ctx);

	for (i = 0; i < img.width * img.height * 4; i += 4) {
		val = 255 - rgba[i];
		transformedImage.push(val, val, val, rgba[i + 3]);
	}

	displayResultImage(img, transformedImage, ctx);
}

//Extracts rgba 1D array of all the pixels in the original image
function getRGBAValues(img, canvas, ctx) {
	canvas.width = img.width;
	canvas.height = img.height;

	ctx.drawImage(img, 0, 0);

	var rgba = ctx.getImageData(
		0, 0, img.width, img.height
	).data;
	return rgba;
}

//Displays the transformed image
function displayResultImage(img, transformedImage, ctx) {
	//Get a pointer to the current location in the image.
	var palette = ctx.getImageData(0, 0, img.width, img.height); //x,y,w,h
	//Wrap your array as a Uint8ClampedArray
	palette.data.set(new Uint8ClampedArray(transformedImage)); // assuming values 0..255, RGBA, pre-mult.
	//Repost the data.
	ctx.putImageData(palette, 0, 0);
	document.getElementById("result").style.display = "initial";
}