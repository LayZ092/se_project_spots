import "../pages/index.css";
import { settings, enableValidation } from "../scripts/validation.js";
import favicon from "../images/favicon.ico";
import Api from "../utils/Api.js";

import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";
import { data } from "autoprefixer";

document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__picture").src = avatar;
document.querySelector(".profile__edit-btn img").src = pencil;
document.querySelector(".profile__add-btn img").src = plus;

// const initialCards = [
//   {
//     name: "Val Thorens",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Restaurant terrace ",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
//   },
//   {
//     name: "An outdoor cafe",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
//   },
//   {
//     name: "A very long bridge, over the forest and through the trees",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
//   },
//   {
//     name: "Tunnel with morning light",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
//   },
//   {
//     name: "Mountain house",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
//   },
//   {
//     name: "Golden state bridge",
//     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
//   },
// ];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const cardAddButton = document.querySelector(".profile__add-btn");

const editProfileModal = document.querySelector("#edit-profile-modal");
const profileExitButton = document.querySelector(".modal__exit-btn");
const editFormElement = editProfileModal.querySelector(".modal__form");
const editProfileModalNameInput = document.querySelector("#profile-name-input");
const editProfileModalDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const cardModalLinkInput = document.querySelector("#add-card-link-input");
const cardModalNameInput = document.querySelector("#add-card-name-input");

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarEditButton = document.querySelector(".profile__edit-picture-btn");
const avatarExitButton = avatarModal.querySelector(".modal__exit-btn");
const avatarFormElement = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#profile-avatar-input");
const avatarSubmitBtn = avatarModal.querySelector(".modal__save-btn");

const deteleCardModal = document.querySelector("#card-delete-modal");
const deleteCardFormElement = deteleCardModal.querySelector(".modal__form");
const deleteCardButton = document.querySelector(".card__delete-btn");
const deleteCardSubmitButton =
  deteleCardModal.querySelector(".modal__save-btn");
const deleteCardExitButton = deteleCardModal.querySelector(".modal__exit-btn");
const deleteCardCancelButton =
  deteleCardModal.querySelector(".modal__cancel-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

const editCardModal = document.querySelector("#add-card-modal");
const cardExitButton = editCardModal.querySelector(".modal__exit-btn");
const cardFormElement = editCardModal.querySelector(".modal__form");
const previewModalExitButton = previewModal.querySelector(".modal__exit-btn");
const cardSubmitBtn = editCardModal.querySelector(".modal__save-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "6f4ae429-4ad9-43f6-abd7-d143d087e687",
    "Content-Type": "application/json",
  },
});

api
  .getCardsAndUserInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
  })
  .catch((err) => {
    console.log(err);
  });

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-btn");
  const cardDeleteButton = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-btn_liked");
  });

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleEscapeKey(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileModalNameInput.value,
      about: editProfileModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.log(err);
    });

  evt.target.reset();
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  api
    .addNewCard({
      name: cardModalNameInput.value,
      link: cardModalLinkInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      closeModal(editCardModal);
      evt.target.reset();
      disableButton(cardSubmitBtn);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deteleCardModal);
    })
    .catch((err) => {
      console.log(err);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deteleCardModal);
  // We need to add something here to remember which card to delete
  // What would you suggest?
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      document.querySelector(".profile__picture").src = data.avatar;
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.log(err);
    });

  evt.target.reset();
  disableButton(avatarSubmitBtn);
}

function disableButton(button) {
  if (!settings || !settings.inactiveButtonClass) {
    console.error("Settings object or inactiveButtonClass is missing");
    return;
  }

  button.classList.add(settings.inactiveButtonClass);
  button.disabled = true;
}

profileEditButton.addEventListener("click", () => {
  openModal(editProfileModal);
  editProfileModalNameInput.value = profileName.textContent;
  editProfileModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editProfileModal,
    [editProfileModalNameInput, editProfileModalDescriptionInput],
    settings
  );
});

profileExitButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

cardAddButton.addEventListener("click", () => {
  openModal(editCardModal);
});

cardExitButton.addEventListener("click", () => {
  closeModal(editCardModal);
});

previewModalExitButton.addEventListener("click", () => {
  closeModal(previewModal);
});

avatarEditButton.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarExitButton.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteCardExitButton.addEventListener("click", () => {
  closeModal(deteleCardModal);
});

deleteCardCancelButton.addEventListener("click", () => {
  closeModal(deteleCardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
deleteCardFormElement.addEventListener("submit", handleDeleteCardSubmit);

[editProfileModal, editCardModal, previewModal].forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
