import { getFormValues, hideAlertError, showAlertError } from "./utils";
import firebase from "./firebase-app";

document.querySelectorAll("#change-password").forEach((page) => {
  let userGlobal = null;
  const form = page.querySelector("form");
  const btnSubmit = form.querySelector("[type=submit]");
  const alertSuccess = form.querySelector(".toast.success");
  const auth = firebase.auth();

  auth.onAuthStateChanged((user) => {
    if (user) {
      userGlobal = user;
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    hideAlertError(form);

    const { password_new, password_confirm, password_current } = getFormValues(
      form
    );

    if (password_new !== password_confirm) {
      return showAlertError(form)({
        message: "Confirme a senha corretamente.",
      });
    }

    if (!userGlobal) {
      return showAlertError(form)({
        message: "Usuário indefinido",
      });
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "Salvando...";

    console.log(password_current);

    auth
      .signInWithEmailAndPassword(userGlobal.email, password_current)
      .then(() => userGlobal.updatePassword(password_new))
      .then(() => alertSuccess.classList.add("open"))
      .catch(showAlertError(form))
      .finally(() => {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = "Salvar";
      });
  });
});
