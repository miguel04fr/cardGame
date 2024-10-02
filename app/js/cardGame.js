
/*
Funcion que devuelve el path de una imagen
de robot de manera aleatoria
*/
function getRandomPathImg(){
    let random = Math.floor(Math.random() * 20) + 1;
    if (random < 10) {
        return `./img/card/robot_0${random}.png`;
    }
    return `./img/card/robot_${random}.png`;

    
}
