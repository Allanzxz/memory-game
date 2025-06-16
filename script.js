const imagens = [
  "a madrid",
  "ahly",
  "ain",
  "auckland",
  "bayern",
  "benfica",
  "bfr",
  "boca",
  "borussia",
  "chelsea",
  "city",
  "esperance",
  "fla",
  "flu",
  "hilal",
  "inter",
  "ittihad",
  "juventus",
  "lafc",
  "leon",
  "mamelodi",
  "miami",
  "monterrey",
  "pachuca",
  "porto",
  "psg",
  "real",
  "redbull",
  "river",
  "seattle",
  "sep",
  "ulsan",
];

const extensoes = [".png", ".jpg", ".webp", ".svg", ".avif"];

let cartas = [];
let cartaVirada = null;
let bloqueado = false;
let tentativas = 0;
let tempo = 0;
let intervalo;

function iniciarJogo() {
  document.getElementById("home").classList.add("oculto");
  document.getElementById("jogo").classList.remove("oculto");
  prepararCartas();
  iniciarCronometro();
}

function prepararCartas() {
  cartas = [];

  imagens.forEach((nome) => {
    const caminho = encontrarImagemDisponivel(nome);
    if (caminho) {
      cartas.push(caminho, caminho); // Duas de cada
    }
  });

  embaralhar(cartas);

  const tabuleiro = document.getElementById("gameBoard");
  tabuleiro.innerHTML = "";

  cartas.forEach((caminho, index) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.index = index;
    carta.addEventListener("click", virarCarta);
    tabuleiro.appendChild(carta);
  });
}

function encontrarImagemDisponivel(nome) {
  for (let ext of extensoes) {
    const path = `images/${nome}${ext}`;
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", path, false);
    try {
      xhr.send();
      if (xhr.status === 200) return path;
    } catch (e) {}
  }
  console.error(`Imagem não encontrada para: ${nome}`);
  return null;
}

function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function virarCarta() {
  if (bloqueado) return;
  const index = this.dataset.index;
  if (this.querySelector("img")) return;

  const img = document.createElement("img");
  img.src = cartas[index];
  this.appendChild(img);

  if (!cartaVirada) {
    cartaVirada = this;
  } else {
    tentativas++;
    document.getElementById(
      "tentativas"
    ).textContent = `Tentativas: ${tentativas}`;

    if (
      cartaVirada.querySelector("img").src === this.querySelector("img").src
    ) {
      cartaVirada = null;
      if (
        document.querySelectorAll("#gameBoard img").length === cartas.length
      ) {
        vitoria();
      }
    } else {
      bloqueado = true;
      setTimeout(() => {
        cartaVirada.innerHTML = "";
        this.innerHTML = "";
        cartaVirada = null;
        bloqueado = false;
      }, 1000);
    }
  }
}

function iniciarCronometro() {
  tempo = 0;
  intervalo = setInterval(() => {
    tempo++;
    document.getElementById("tempo").textContent = `Tempo: ${tempo}s`;
  }, 1000);
}

function vitoria() {
  clearInterval(intervalo);
  const msg = document.getElementById("vitoria");
  msg.classList.add("show");
}
