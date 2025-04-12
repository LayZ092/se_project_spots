import "../pages/index.css";
import {
  settings,
  enableValidation,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

import logo from "../images/logo.svg";
import avatar from "../images/avatar.jpg";
import pencil from "../images/pencil.svg";
import plus from "../images/plus.svg";

document.querySelector(".header__logo").src = logo;
document.querySelector(".profile__edit-btn img").src = pencil;
document.querySelector(".profile__add-btn img").src = plus;

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

const deleteCardModal = document.querySelector("#card-delete-modal");
const deleteCardFormElement = deleteCardModal.querySelector(".modal__form");
const deleteCardButton = document.querySelector(".card__delete-btn");
const deleteCardSubmitButton =
  deleteCardModal.querySelector(".modal__save-btn");
const deleteCardExitButton = deleteCardModal.querySelector(".modal__exit-btn");
const deleteCardCancelButton =
  deleteCardModal.querySelector(".modal__cancel-btn");

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
    document.querySelector(".profile__picture").src = userInfo.avatar;
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

  if (cardIsLiked(data)) {
    cardLikeButton.classList.add("card__like-btn_liked");
  }

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  cardLikeButton.addEventListener("click", (evt) =>
    handleCardLike(evt, cardLikeButton, data._id)
  );

  cardDeleteButton.addEventListener("click", () =>
    handleDeleteCard(cardElement, data._id)
  );

  return cardElement;
}

function cardIsLiked(data) {
  return data.isLiked;
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

function handleCardLike(evt, cardLikeButton, cardId) {
  const isLiked = cardLikeButton.classList.contains("card__like-btn_liked");

  api
    .changeLikeStatus(cardId, isLiked)
    .then((updatedCard) => {
      cardLikeButton.classList.toggle("card__like-btn_liked");

      return updatedCard.isLiked;
    })
    .catch((err) => {
      console.log(err);
    });
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
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editProfileModalNameInput.value,
      about: editProfileModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
      evt.target.reset();
      disableButton(cardSubmitBtn);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
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
    })
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleDeleteCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitBtn.textContent = "Delete";
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteCardModal);
}

function handleAvatarFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editAvatar({
      avatar: avatarInput.value,
    })
    .then((data) => {
      document.querySelector(".profile__picture").src = data.avatar;
      closeModal(avatarModal);
      evt.target.reset();
      disableButton(avatarSubmitBtn);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitBtn.textContent = "Save";
    });
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
  closeModal(deleteCardModal);
});

deleteCardCancelButton.addEventListener("click", () => {
  closeModal(deleteCardModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardFormElement.addEventListener("submit", handleAddCardSubmit);
avatarFormElement.addEventListener("submit", handleAvatarFormSubmit);
deleteCardFormElement.addEventListener("submit", handleDeleteCardSubmit);

[
  editProfileModal,
  editCardModal,
  previewModal,
  deleteCardModal,
  avatarModal,
].forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
