class Ship{
    constructor(length){
        this.length = length;
        this.numHits = 0;
    }

    hit(){
        this.hit++;
    }

    isSunk(){
        return this.numHits >= this.length;
    }
}

export default Ship;