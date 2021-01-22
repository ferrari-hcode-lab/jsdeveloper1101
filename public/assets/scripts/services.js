import { format } from "date-fns";
import firebase from "./firebase-app";
import {
  appendTemplate,
  formatCurrency,
  getQueryString,
  onSnapshotError,
  setFormValues,
} from "./utils";

let serviceSumarry = [];

const renderServivesOptions = (context, serviceOptions) => {
  const optionsEl = context.querySelector(".options");

  optionsEl.innerHTML = "";

  serviceOptions.forEach((item) => {
    const label = appendTemplate(
      optionsEl,
      "label",
      `<input type="checkbox" name="service" value="${item.id}" />
        <div class="square">
            <div class="square2"></div>
        </div>
        <div class="content">
            <span class="name">${item.name}</span>
            <span class="descripition">${item.description}</span>
            <span class="price">${formatCurrency(item.price)}</span>
        </div>`
    );

    label.querySelector("[type=checkbox]").addEventListener("change", (e) => {
      const { checked, value } = e.target;

      if (checked) {
        //const { id } = serviceOptions.filter((option) => {
        const service = serviceOptions.filter((option) => {
          //return +option.id === +value;
          return Number(option.id) === Number(value);
        })[0];

        //serviceSumarry.push(id);
        serviceSumarry.push(service.id);
      } else {
        serviceSumarry = serviceSumarry.filter((id) => {
          return Number(id) !== Number(value);
        });
      }

      renderServiceSummary(context, serviceOptions);
    });
  });
};

const renderServiceSummary = (context, serviceOptions) => {
  const tbodyEL = context.querySelector(
    "aside#btn-aside >section >table >tbody"
  );
  tbodyEL.innerHTML = "";

  serviceSumarry
    .map(
      (id) => serviceOptions.filter((item) => Number(item.id) === Number(id))[0]
    )
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      } else if (a.name < b.name) {
        return -1;
      } else {
        return 0;
      }
    })
    .forEach((item) => {
      appendTemplate(
        tbodyEL,
        "tr",
        `<td>${item.name}</td>
          <td class="price">${formatCurrency(item.price)}</td>`
      );
    });

  const totalEL = context.querySelector(
    "#btn-aside > footer > div > span.total"
  );

  const total = serviceSumarry
    .map((id) => serviceOptions.filter((item) => +item.id === +id)[0])
    .reduce((totalResult, item) => Number(totalResult) + Number(item.price), 0);

  totalEL.innerHTML = formatCurrency(total);
};

document.querySelectorAll("#schedules-services").forEach((page) => {
  const db = firebase.firestore();

  db.collection("services").onSnapshot((snapshot) => {
    const services = [];
    snapshot.forEach((item) => {
      services.push(item.data());
    }, onSnapshotError);

    renderServivesOptions(page, services);
    renderServiceSummary(page, services);
  });
  const params = getQueryString();
  const form = page.querySelector("form");

  console.log(params);

  setFormValues(form, params);

  const buttonSummary = page.querySelector("#button-open");

  buttonSummary.addEventListener("click", () => {
    page.querySelector("aside").classList.toggle("open");
  });
});
