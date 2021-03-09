import Cropper from "cropperjs";
import firebase from "./firebase-app";

document.querySelectorAll("#change-photo").forEach((page) => {
  let cropper = null;
  let userGlobal = null;
  const imageElement = page.querySelector("#photo-preview");
  const buttonElement = page.querySelector(".choose-photo");
  const inputFileElement = page.querySelector("#file");
  const form = imageElement.closest("form");
  const btnSubmit = form.querySelector("[type=submit]");

  const bodyElement = document.body;

  const auth = firebase.auth();

  const uploadFile = (files) => {
    if (files) {
      const file = files[0];

      buttonElement.disabled = true;

      const reader = new FileReader();

      reader.onload = () => {
        imageElement.src = reader.result;

        form.classList.add("cropping");

        cropper = new Cropper(imageElement, {
          aspectRatio: 1 / 1,
          // crop(event) {
          //     console.log(event)
          // }
        });
      };

      reader.readAsDataURL(file);
    }
  };

  auth.onAuthStateChanged((user) => {
    if (user) {
      userGlobal = user;
      imageElement.src = user.photoURL || "https://i.pravatar.cc/256";
    } else {
      menu.classList.remove("logged");
    }
  });

  bodyElement.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadFile(e.dataTransfer.files);
  });
  bodyElement.addEventListener("dragover", (e) => e.preventDefault());

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    form.classList.remove("cropping");
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "Salvando...";

    imageElement.src = cropper.getCroppedCanvas().toDataURL("image/png");

    cropper.getCroppedCanvas().toBlob((blob) => {
      const storage = firebase.storage();

      const fileRef = storage.ref().child(`photos/${userGlobal.uid}.png`);

      fileRef
        .put(blob)
        .then((snapshot) => snapshot.ref.getDownloadURL())
        .then((photoURL) => userGlobal.updateProfile({ photoURL }))
        .then(() => {
          document.querySelector(
            "#header > div.menu.logged > div > div > picture > a > img"
          ).src = userGlobal.photoURL;
          console.log("foto atualizada");
        });

      cropper.destroy();
    });
  });

  imageElement.addEventListener("click", (e) => {
    inputFileElement.click();
  });
  buttonElement.addEventListener("click", (e) => {
    inputFileElement.click();
  });

  inputFileElement.addEventListener("change", (e) => {
    uploadFile(e.target.files);
    e.target.value = "";
  });
});
