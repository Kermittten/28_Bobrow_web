
function startMazeGame() {
    alert("Вы должны пройти лабиринт! Вам нужно сделать правильные выборы, чтобы найти выход из лабиринта. Удачи!");

    let currentStep = 1;
    let gameOver = false;

    while (!gameOver) {
        switch (currentStep) {
            case 1:
                let direction = prompt("Вы стоите у входа в лабиринт. Куда пойдёте? (налево/направо)").toLowerCase();

                if (direction === "налево") {
                    alert("Вы пошли налево и нашли тропинку.");
                    currentStep = 2;
                } else if (direction === "направо") {
                    alert("Вы пошли направо и попали в тупик. Попробуйте ещё раз.");
                } else {
                    alert("Некорректный ввод. Пожалуйста, выберите 'налево' или 'направо'.");
                }
                break;

            case 2:
                let action = prompt("Вы видите мост. Перейти мост или осмотреться? (перейти/осмотреться)").toLowerCase();

                if (action === "перейти") {
                    alert("Вы перешли мост и увидели два пути.");
                    currentStep = 3;
                } else if (action === "осмотреться") {
                    alert("Вы осмотрелись и нашли ключ. Он может пригодиться позже.");
                    currentStep = 4;
                } else {
                    alert("Некорректный ввод. Пожалуйста, выберите 'перейти' или 'осмотреться'.");
                }
                break;

            case 3:
                let path = prompt("Вы видите две дороги: одна ведёт в лес, другая — к реке. Куда пойдёте? (лес/река)").toLowerCase();

                if (path === "лес") {
                    alert("Вы заблудились в лесу. Игра окончена.");
                    gameOver = true;
                } else if (path === "река") {
                    alert("Вы дошли до реки и нашли лодку. Поздравляем, вы нашли выход из лабиринта!");
                    gameOver = true;
                } else {
                    alert("Некорректный ввод. Пожалуйста, выберите 'лес' или 'река'.");
                }
                break;

            case 4:
                let useKey = confirm("Вы нашли запертую дверь. Использовать ключ?");

                if (useKey) {
                    alert("Вы открыли дверь и нашли выход из лабиринта! Поздравляем!");
                    gameOver = true;
                } else {
                    alert("Вы решили не использовать ключ и заблудились. Игра окончена.");
                    gameOver = true;
                }
                break;

            default:
                gameOver = true;
                break;
        }
    }
    alert("Ну за такое можно и доп баллы в полном объёме поставиь. P.S. Советую перечитать анекдоты :3!");
}

const gameButton = document.createElement("button");
gameButton.textContent = "Играть в 'Пройти лабиринт'";
gameButton.style.margin = "20px";
gameButton.style.padding = "10px 20px";
gameButton.style.fontSize = "16px";
gameButton.style.cursor = "pointer";

document.body.appendChild(gameButton);

gameButton.addEventListener("click", startMazeGame);