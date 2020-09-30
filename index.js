class Pet {
    constructor (name) {
        if (this.getCookie('data') !== '') {
            const decodedCookie = JSON.parse(this.getCookie('data'))
            console.log(decodedCookie)
            this.stats = {
                'spriteState': decodedCookie.stats.spriteState,
                'sleepState': decodedCookie.stats.sleepState,
                'happiness': decodedCookie.stats.happiness,
                'hunger': decodedCookie.stats.hunger,
                'health': decodedCookie.stats.health,
                'sleepiness': decodedCookie.stats.sleepiness,
                'affection': decodedCookie.stats.affection
            }
            this.clickerStats = {
                'clickCount': decodedCookie.clickerStats.clickCount,
                'multiplier': decodedCookie.clickerStats.multiplier,
                'funds': decodedCookie.clickerStats.funds,
                'food': decodedCookie.clickerStats.food,
                'medicine': decodedCookie.clickerStats.medicine
            }
    
        }
        else {
            this.stats = {
                'spriteState': 'neutral',
                'sleepState': false,
                'happiness': 75,
                'hunger': 80,
                'health': 100,
                'sleepiness': 80,
                'affection': 10
            }
            this.clickerStats = {
                'clickCount': 0,
                'multiplier': 1,
                'funds': 10,
                'food': 5,
                'medicine': 1
            }    
        }
        this.name = name
        this.sprites = {
            'neutral': 'neutral.svg',
            'happy': 'happy.svg',
            'sad': 'sad.svg',
            'angry': 'angry.svg',
            'sleeping': 'sleeping.svg'
        }
        this.sprite = document.getElementById('tamagochi')
        this.infoContainer = document.getElementById('pet-data')
        this.feedButton = document.getElementById('feed')
        this.medButton = document.getElementById('give-medicine')
        this.buyFoodButton = document.getElementById('buy-food')
        this.buyMedButton = document.getElementById('buy-medicine')

        this.randomTick = this.randomTick.bind(this)
        this.setCookie = this.setCookie.bind(this)
        this.getCookie = this.getCookie.bind(this)

        setInterval(this.randomTick, 1000)

        this.sprite.addEventListener("click", this.petClick.bind(this))
        this.feedButton.addEventListener("click", this.feedPet.bind(this))
        this.medButton.addEventListener("click", this.healPet.bind(this))
        this.buyFoodButton.addEventListener("click", this.buyFood.bind(this))
        this.buyMedButton.addEventListener("click", this.buyMed.bind(this))
    }

    randomTick () {
        const hungerTick = Math.floor(Math.random() * 10000)
        const healthTick = Math.floor(Math.random() * 12000)
        const sleepTick = Math.floor(Math.random() * 5000)
        const moneyTick = Math.floor(Math.random() * 150)

        if (hungerTick < 100) {
            if (this.stats.sleepState == true) {

            }
            else if (this.stats.health <= 15) {
                this.stats.hunger = this.stats.hunger - 3
                this.stats.happiness--
            }
            else if (this.stats.hunger >= 90) {
                this.stats.hunger = this.stats.hunger - 2
                this.stats.happiness++
            }
            else {
                this.stats.hunger--
            }
            if (this.stats.hunger < 0) {
                this.stats.hunger = 0
                this.stats.happiness = this.stats.happiness - 5
            }
            console.log('hunger: '+this.stats.hunger)
        }

        if (healthTick < 100) {
            this.stats.health--
            if (this.stats.health < 0) {
                this.stats.health = 0
                this.stats.happiness = this.stats.happiness - 10
                this.stats.affection--
            }
            console.log('health: '+this.stats.health)
        }

        if (sleepTick < 100) {
            if (this.stats.sleepState == true) {
                this.stats.sleepiness++
                if (this.stats.sleepiness >= 80 && sleepTick <= 50) {
                    this.stats.sleepState = false
                    if (document.hasFocus()) {
                        this.stats.affection = this.stats.affection + 10
                    }
                }
            }
            else {
                this.stats.sleepiness--
                if (this.stats.sleepiness <= 10 && sleepTick <= 50) {
                    this.stats.sleepState = true
                }
            }

            if (this.stats.sleepiness < 0) {
                this.stats.sleepiness = 0
            }
            else if (this.stats.sleepiness > 100) {
                this.stats.sleepiness = 100
            }
            console.log('sleepState: '+this.stats.sleepState)
            console.log('sleepiness: '+this.stats.sleepiness)
        }

        if (moneyTick < 100) {
            this.petClick()
        }

        if (this.stats.sleepState == true){
            this.spriteState = this.sprites.sleeping
        }
        else if (this.stats.health <= 15 || this.stats.hunger <= 10) {
            this.spriteState = this.sprites.sad
        }
        else if (this.stats.happiness <= 10) {
            this.spriteState = this.sprites.angry
        }
        else if (this.stats.happiness >= 80 && this.stats.affection >= 80) {
            this.spriteState = this.sprites.happy
        }
        else {
            this.spriteState = this.sprites.neutral
        }

        if (this.stats.happiness < 0) {
            this.stats.happiness = 0
        }
        else if (this.stats.happiness > 100) {
            this.stats.happiness = 100
        }

        if (this.stats.affection < 0) {
            this.stats.affection = 0
        }
        else if (this.stats.affection > 100) {
            this.stats.affection = 100
        }

        this.sprite.src = this.spriteState
        console.log('sprite: '+this.sprite.src)

        this.infoContainer.innerHTML = `
        <p>${this.name}</p>
        <p>Money: ${this.clickerStats.funds} <div class="bar"><div class="progress" style="width: ${this.clickerStats.clickCount}%;"></div></div></p>
        <p>Food: ${this.clickerStats.food}</p>
        <p>Medicine: ${this.clickerStats.medicine}</p>
        <p>Happiness: <div class="bar"><div class="progress" style="width: ${this.stats.happiness}%;"></div></div></p>
        <p>Health: <div class="bar"><div class="progress" style="width: ${this.stats.health}%;"></div></div></p>
        <p>Hunger: <div class="bar"><div class="progress" style="width: ${this.stats.hunger}%;"></div></div></p>
        <p>Sleepiness: <div class="bar"><div class="progress" style="width: ${this.stats.sleepiness}%;"></div></div></p>
        <p>Affection: <div class="bar"><div class="progress" style="width: ${this.stats.affection}%;"></div></div></p>
        `

        this.setCookie('data', JSON.stringify(
            {
                'stats': {
                    'spriteState': this.stats.spriteState,
                    'sleepState': this.stats.sleepState,
                    'happiness': this.stats.happiness,
                    'hunger': this.stats.hunger,
                    'health': this.stats.health,
                    'sleepiness': this.stats.sleepiness,
                    'affection': this.stats.affection
                },
                'clickerStats': {
                    'clickCount': this.clickerStats.clickCount,
                    'multiplier': this.clickerStats.multiplier,
                    'funds': this.clickerStats.funds,
                    'food': this.clickerStats.food,
                    'medicine': this.clickerStats.medicine
                }
            }
        ), 365)
    }

    petClick () {
        console.log(this.clickerStats.clickCount)
        this.clickerStats.clickCount++
        if (this.stats.sleepState == true) {
            this.clickerStats.clickCount++
        }
        if (this.clickerStats.clickCount >= 100) {
            this.clickerStats.clickCount = 0
            this.stats.affection++
            this.clickerStats.funds++
        }
    }

    feedPet () {
        if (this.clickerStats.food == 0 || this.stats.hunger == 100) {
            return
        }
        if (this.stats.sleepState == true) {
            alert(`Cannot feed ${this.name} while they're asleep!`)
            return
        }
        this.stats.hunger = 100
        this.stats.affection = this.stats.affection + 2
        this.clickerStats.food--
    }

    healPet () {
        if (this.clickerStats.medicine == 0 || this.stats.health == 100) {
            return
        }
        if (this.stats.sleepState == true) {
            alert(`Cannot heal ${this.name} while they're asleep!`)
            return
        }
        this.stats.health = 100
        this.stats.happiness = this.stats.happiness - 2
        this.clickerStats.medicine--
    }

    buyFood () {
        if (this.clickerStats.funds < 10) {
            return
        }
        this.clickerStats.food++
        this.clickerStats.funds = this.clickerStats.funds - 10
    }

    buyMed () {
        if (this.clickerStats.funds < 50) {
            return
        }
        this.clickerStats.medicine++
        this.clickerStats.funds = this.clickerStats.funds - 50
    }

    setCookie (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie (cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    }
}