// Write your code below:
const ul = document.querySelector("ul");
const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
let editId = null;

window.addEventListener("load", (e) => {
  axios
    .get("https://crudcrud.com/api/4fc51e8097ba4b209550846f40f93184/userData")
    .then((data) => {
      data.data.forEach((userData) => {
        let { username, email, phone, _id } = userData;
        displayList(username, email, phone, _id);
      });
    })
    .catch((err) => console.log(err));
});

function handleFormSubmit(e) {
  e.preventDefault();
  const username = e.target.username;
  const email = e.target.email;
  const phone = e.target.phone;
  let userData = {
    username: username.value,
    email: email.value,
    phone: phone.value,
  };

  // localStorage.setItem(email.value, JSON.stringify(userData));
  if (editId) {
    axios
      .put(
        `https://crudcrud.com/api/4fc51e8097ba4b209550846f40f93184/userData/${editId}`,
        {
          username: username.value,
          email: email.value,
          phone: phone.value,
        }
      )
      .then((res) => {
        // console.log(res);
        const elementToBeEdited = document.getElementById(editId);
        elementToBeEdited.innerHTML = `<span>${username.value} -${email.value} -${phone.value}</span><input type='button' value='Delete' class = 'deleteBtn'><input type='button' value='Edit' class = 'editBtn'>`;
        editId = null;
      })
      .catch((err) => {
        console.log(err);
        editId = null;
      });
    return;
  }

  axios
    .post(
      "https://crudcrud.com/api/4fc51e8097ba4b209550846f40f93184/userData",
      userData
    )
    .then((data) => {
      // console.log(data);
      const { email, phone, username, _id } = data.data;
      // console.log(email, phone, username, _id);
      // console.log(data);
      // elementToBeEdited.innerHTML = `<span>${username} -${email} -${phone}</span><input type='button' value='Delete' class = 'deleteBtn'><input type='button' value='Edit' class = 'editBtn'>`;

      displayList(username, email, phone, _id);
    })
    .catch((err) => console.log(err));
}

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    const deleteId = e.target.parentElement.getAttribute("id");
    // console.log(deleteId);
    axios
      .delete(
        `https://crudcrud.com/api/4fc51e8097ba4b209550846f40f93184/userData/${deleteId}`
      )
      .then((data) => {
        // console.log(data);
        e.target.parentElement.parentElement.removeChild(
          e.target.parentElement
        );
      })
      .catch((err) => console.log(err));
  } else if (e.target.classList.contains("editBtn")) {
    let parent = e.target.parentElement;
    editId = e.target.parentElement.getAttribute("id");

    const [username1, email1, phone1] =
      parent.firstElementChild.textContent.split(" -");
    email.value = email1;
    username.value = username1;
    phone.value = phone1;
  }
});

function displayList(username, email, phone, _id) {
  let list = document.querySelector("ul");
  let listElement = document.createElement("li");
  listElement.innerHTML = `<span>${username} -${email} -${phone}</span>`;
  listElement.setAttribute("id", _id);
  let deleteBtn = document.createElement("input");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.setAttribute("value", "Delete");
  deleteBtn.setAttribute("class", "deleteBtn");
  listElement.appendChild(deleteBtn);
  list.appendChild(listElement);

  let editBtn = document.createElement("input");
  editBtn.setAttribute("type", "button");
  editBtn.setAttribute("value", "Edit");
  editBtn.setAttribute("class", "editBtn");
  listElement.appendChild(editBtn);
}
