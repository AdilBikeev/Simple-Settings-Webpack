function createAnalitics(): object {
    let counter = 0
    let isDestroyed: boolean = false
const unused = 15;
    const listener = (): number => counter++

    document.addEventListener("click", listener)

    return {
        destroy() {
            document.removeEventListener("click", listener)
            isDestroyed = true
        },

        getClicks() {
            if (isDestroyed) {
                return "Analitics is destroyed"
            }

            return counter
        }
    }
}

window['analitics'] = createAnalitics()