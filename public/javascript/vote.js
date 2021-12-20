function openModal() {
  let myModal = new bootstrap.Modal(document.getElementById('myModal'))
  myModal.show();
}

function openAnswerModal() {
  let myAnswerModal = new bootstrap.Modal(document.getElementById('myAnswerModal'))
  myAnswerModal.show();
}

async function voteClickHandler(event) {
  event.preventDefault();

  const id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  const response = await fetch("/api/questions/vote", {
    method: "PUT",
    body: JSON.stringify({
      question_id: id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (response.ok) {
    document.location.reload();
  } else if (response.status === 409) {
    openModal()
  } else {
    alert(response.statusText)
  }
}

document.querySelector(".vote-btn").addEventListener("click", voteClickHandler);


async function secondVoteClickHandler(event) {
  event.preventDefault();

  const id = event.target.getAttribute("data-answerId")

  const response = await fetch("/api/answers/vote", {
    method: "PUT",
    body: JSON.stringify({
      answer_id: id
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });


  if (response.ok) {
    document.location.reload();
  } else if (response.status === 409) {
    openAnswerModal()
  } else {
    alert(response.statusText);
  }
}

const answerVoteButtons = document.querySelectorAll(".second-vote-btn")
answerVoteButtons.forEach(button => {
  button.addEventListener("click", secondVoteClickHandler);
})
