const usersDataList = document.getElementById("table-body");
const modalBackground = document.getElementById("modal-background");
const filterForm = document.getElementById("filter-form");

const addNewUserBtn = document.getElementById("btn-new-user");
const modalNewUser = document.getElementById("new-user-modal");
const formNewUser = document.querySelector(".new-user-form");
const cancelNewUserForm = document.querySelector(".cancel-btn");

const editUserModal = document.getElementById("edit-user-modal");

const modalDelete = document.getElementById("delete-user-modal");
const deleteCancelBtn = document.getElementById("cancel-delete");
const deleteConfirmBtn = document.getElementById("delete-user-btn");

let deleteUserBtn;
let editUserBtn;

const userFilter = e => {

  fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users?search=${filterForm[0].value}`)
    .then(data => data.json())
    .then(info => {
      let usersInfo = "";
      info.forEach(user => {
        usersInfo = `
          <tr class="user-info">
          <th><input type="checkbox" id="${user.id}"></th>
          <th>${user.fullname}</th>
          <th>${user.email}</th>
          <th>${user.address}</th>
          <th>${user.phone}</th>
          <th>
           <i id="${user.id}" class="material-icons edit" title="Edit">&#xE254;</i>
           <i id="${user.id}" class="material-icons delete" title="Delete">&#xE872;</i>
          </th>
        </tr>`
      });
      usersDataList.innerHTML = usersInfo;

      clickEvents();
    });

};

const clickEvents = () => {

  //select DOM elements to be able to delete users
  deleteUserBtn = document.getElementsByClassName("delete");

  //variable to store the id of the user to delete 
  let idUser;

  //iterate through list of delete btns and listen to click events to get 
  //the id of the clicked btn and show the delete modals
  for (let i = 0; i < deleteUserBtn.length; i++) {
    deleteUserBtn[i].onclick = e => {
      idUser = e.target.id;
      modalDelete.classList.remove("no-show");
      modalBackground.classList.remove("no-show");
    };
  };

  //add css class no-show to modal if operation is canceled
  deleteCancelBtn.onclick = () => {
    modalDelete.classList.add("no-show");
    modalBackground.classList.add("no-show");
  };

  //execute deleteUser function if operation is confirmed
  deleteConfirmBtn.onclick = () => {
    deleteUser(idUser);
  };

  //select DOM elements to be able to edit users
  editUserBtn = document.getElementsByClassName("edit");

  for (let i = 0; i < editUserBtn.length; i++) {
    editUserBtn[i].onclick = e => {
      editUser(e)
    };
  };

};

const addUser = () => {
  const newUser = {
    address: formNewUser[2].value,
    email: formNewUser[1].value,
    fullname: formNewUser[0].value,
    phone: formNewUser[3].value
  };

  fetch("https://tp-js-2-api-wjfqxquokl.now.sh/users", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  })
    .then(data => data.json())
    .then(info => {
      const usersDataList = document.getElementById("table-body");
      let newUserInfo = `
      <tr class="user-info">
        <th><input type="checkbox"></th>
        <th>${info.fullname}</th>
        <th>${info.email}</th>
        <th>${info.address}</th>
        <th>${info.phone}</th>
        <th>
         <i id="${info.id}" class="material-icons edit" title="Edit">&#xE254;</i>
         <i id="${info.id}" class="material-icons delete" title="Delete">&#xE872;</i>
        </th>
      </tr>`;
      usersDataList.innerHTML += newUserInfo;
      modalNewUser.classList.add("no-show");
      modalBackground.classList.add("no-show");

      clickEvents();
    });
};

const deleteUser = userId => {

  fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(data => data.json())
    .then(info => {
      modalDelete.classList.add("no-show");
      modalBackground.classList.add("no-show");
      usersDataList.innerHTML = '';
      let usersInfo = "";
      info.forEach(user => {
        usersInfo += `
                 <tr class="user-info">
                   <th><input type="checkbox" id="${user.id}"></th>
                   <th>${user.fullname}</th>
                   <th>${user.email}</th>
                   <th>${user.address}</th>
                   <th>${user.phone}</th>
                   <th>
                     <i id="${user.id}" class="material-icons edit" title="Edit">&#xE254;</i>
                     <i id="${user.id}" class="material-icons delete" title="Delete">&#xE872;</i>
                   </th>
                 </tr>`
      });
      usersDataList.innerHTML += usersInfo;

      clickEvents();
    });
};

const editUser = e => {

  editUserModal.classList.remove("no-show");
  modalBackground.classList.remove("no-show");

  fetch("https://tp-js-2-api-wjfqxquokl.now.sh/users")
    .then(data => data.json())
    .then(info => {
      let userToEdit;

      info.forEach(user => {
        if (Object.values(user).includes(Number(e.target.id)) ? user : '') {
          userToEdit = user;
        } else {
          return userToEdit;
        }
      });

      editUserModal.innerHTML = `
             <div class="edit-user-form-header">
               <p>Edit employee</p>
             </div>
             <form class="edit-user-form">
               Name<input type="text" value=${userToEdit.fullname}>
               Email<input type="email" value=${userToEdit.email}>
               Address<input type="text" value=${userToEdit.address}>
               Phone<input type="number" value=${userToEdit.phone}>      
               <button type="button"id="cancel-edit-user">Cancel</button>
               <button type="button" id="add-edited-user-btn">Save</button>
             </form>`;

      const confirmEditUserBtn = document.getElementById("add-edited-user-btn");
      const cancelEditUserBtn = document.getElementById("cancel-edit-user");
      const formEditUser = document.querySelector(".edit-user-form");

      confirmEditUserBtn.onclick = () => {
        const editedUser = {
          address: formEditUser[2].value,
          email: formEditUser[1].value,
          fullname: formEditUser[0].value,
          phone: formEditUser[3].value
        };

        fetch(`https://tp-js-2-api-wjfqxquokl.now.sh/users/${e.target.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedUser)
        })
          .then(data => data.json())
          .then(info => {
            usersDataList.innerHTML = ``;
            let usersInfo = "";
            info.forEach(user => {
              usersInfo += `
                      <tr class="user-info">
                       <th><input type="checkbox" id="${user.id}"></th>
                       <th>${user.fullname}</th>
                       <th>${user.email}</th>
                       <th>${user.address}</th>
                       <th>${user.phone}</th>
                       <th>
                         <i id="${user.id}" class="material-icons edit" title="Edit">&#xE254;</i>
                         <i id="${user.id}" class="material-icons delete" title="Delete">&#xE872;</i>
                       </th>
                     </tr>`
            });
            usersDataList.innerHTML += usersInfo;

            editUserModal.classList.add("no-show");
            modalBackground.classList.add("no-show");

            clickEvents();
          });
      };

      cancelEditUserBtn.onclick = () => {
        editUserModal.classList.add("no-show");
        modalBackground.classList.add("no-show");
      };
    });
};

const main = () => {

  fetch("https://tp-js-2-api-wjfqxquokl.now.sh/users")
    .then(data => data.json())
    .then(info => {
      let usersInfo = "";
      info.forEach(user => {
        usersInfo += `
        <tr class="user-info">
          <th><input type="checkbox" id="${user.id}"></th>
          <th>${user.fullname}</th>
          <th>${user.email}</th>
          <th>${user.address}</th>
          <th>${user.phone}</th>
          <th>
           <i id="${user.id}" class="material-icons edit" title="Edit">&#xE254;</i>
           <i id="${user.id}" class="material-icons delete" title="Delete">&#xE872;</i>
          </th>
        </tr>`
      });
      usersDataList.innerHTML += usersInfo;

      clickEvents();
    });

  filterForm.onsubmit = e => {
    e.preventDefault();
    userFilter();
  };

  addNewUserBtn.onclick = () => {
    //remove no-show css class to display the form 
    modalNewUser.classList.remove("no-show");
    modalBackground.classList.remove("no-show");

    //adds no-show css class to elements after operation gets canceled
    cancelNewUserForm.onclick = () => {
      modalNewUser.classList.add("no-show");
      modalBackground.classList.add("no-show");
    };

    //execute the function to add user on form submit
    formNewUser.onsubmit = e => {
      e.preventDefault();
      addUser();
    };
  };

};

main();