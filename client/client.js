//const { response } = require("express");

const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const newsElement = document.querySelector(".news");
const API_URL = "http://localhost:5000/news";

loadingElement.style.display = "";

listAllNews();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const jsonDataToSend = {
    name,
    content,
  };
  form.style.display = "none";
  loadingElement.style.display = "";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(jsonDataToSend),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((createdNew) => {
      form.reset();
      setTimeout(() => {
        form.style.display = "";
      }, 30000);

      listAllNews();
      loadingElement.style.display = "none";
    });
});

function listAllNews() {
  newsElement.innerHTML = "";
  fetch(API_URL)
    .then((response) => response.json())
    .then((news) => {
      news.reverse();
      news.forEach((element) => {
        const div = document.createElement("div");
        const header = document.createElement("h3");
        header.textContent = element.name;

        const contents = document.createElement("p");
        contents.textContent = element.content;

        const date = document.createElement("small");
        date.textContent = new Date(element.created_date);

        div.appendChild(header);
        div.appendChild(contents);
        div.appendChild(date);

        newsElement.appendChild(div);
      });
    });
  loadingElement.style.display = "none";
}
