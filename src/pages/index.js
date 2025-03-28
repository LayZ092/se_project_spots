import "../pages/index.css";
import { settings, enableValidation } from "../scripts/validation.js";
import favicon from "../images/favicon.ico";

import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";

document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__picture").src = avatar;
document.querySelector(".profile__edit-btn img").src = pencil;
document.querySelector(".profile__add-btn img").src = plus;

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace ",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden state bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

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

  cardDeleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

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
  profileName.textContent = editProfileModalNameInput.value;
  profileDescription.textContent = editProfileModalDescriptionInput.value;
  closeModal(editProfileModal);
  evt.target.reset();
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const inputValues = {
    name: cardModalNameInput.value,
    link: cardModalLinkInput.value,
  };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);
  closeModal(editCardModal);
  evt.target.reset();
  disableButton(cardSubmitBtn, settings);
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

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});

[editProfileModal, editCardModal, previewModal].forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
