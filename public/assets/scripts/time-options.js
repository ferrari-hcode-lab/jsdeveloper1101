import { format, parse } from "date-fns";
import { appendTemplate, getQueryString, setFormValues } from "./utils";
import firebase from "./firebase-app";
import { ptBR } from "date-fns/locale";

const renderTimeOptions = (context, timeOptions) => {
  const targetElement = context.querySelector(".options");

  targetElement.innerHTML = "";

  timeOptions.forEach((item) => {
    appendTemplate(
      targetElement,
      "label",
      `
        <input type="radio" name="option" value="${item.value}" />
        <span>${item.value}</span>
      `
    );
  });
};

const validateSubmitForm = (context) => {
  const button = context.querySelector("[type=submit]");

  const checkValue = () => {
    //button.disabled = !context.querySelector("[name=option]:checked");

    if (context.querySelector("[name=option]:checked")) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  };

  window.addEventListener("load", (e) => checkValue());

  context.querySelectorAll("[name=option]").forEach((input) => {
    input.addEventListener("change", (e) => {
      checkValue();
    });
  });

  context.querySelector("form").addEventListener("submit", (e) => {
    if (!context.querySelector("[name=option]:checked")) {
      button.disabled = true;
      e.preventDafault();
    }
  });
};

document.querySelectorAll("#schedules-times-options").forEach((page) => {
  const db = firebase.firestore();

  db.collection("time-options").onSnapshot((snapshot) => {
    const timeOptions = [];
    snapshot.forEach((item) => {
      timeOptions.push(item.data());
    });

    renderTimeOptions(page, timeOptions);

    validateSubmitForm(page);
  });

  const params = getQueryString();
  const title = page.querySelector("h3");
  const form = page.querySelector("form");
  const scheduleAt = parse(params.schedule_at, "yyyy-MM-dd", new Date());

  console.log(params);

  //page.querySelector("[name=schedule_at]").value = params.schedule_at;
  setFormValues(form, params);

  //getFormValues(form);

  title.innerHTML = format(scheduleAt, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
});
