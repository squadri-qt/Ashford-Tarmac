import {atFormSend} from './form'

const classNames = {
    active: 'at-step-active'
}

function next(steps, active, btn) {
    const next = (active + 1) % steps.length
    steps[active].element.classList.remove(classNames.active)
    steps[next].element.classList.add(classNames.active)
    const btnText = steps[next].element.dataset.buttonText
    if (typeof btnText !== 'undefined') {
        btn.firstElementChild.textContent = btnText
    }
    return {active: next, submit: typeof steps[active].element.dataset.formSubmit !== 'undefined'}
}

function initGetEstimate(selector, on_result) {
    document.querySelectorAll(selector).forEach(root => {
        const form = root.closest('form')
        const nextBtn = root.querySelector('button')
        const stepTitle = [...root.querySelectorAll('nav > span')].map((element, index) => ({element, index}))
        const steps = [...root.querySelectorAll('.at-step')].map((element, index) => ({element, index}))
        let active = 0
        if (nextBtn == null) {
            return
        }
        nextBtn.addEventListener('click', () => {
            const valid = [...steps[active].element.querySelectorAll(':valid')]
            valid.forEach(el => el.classList.remove('at-invalid'))
            const invalid = [...steps[active].element.querySelectorAll(':invalid')]
            invalid.forEach(el => el.classList.add('at-invalid'))
            if (invalid.length === 0) {
                const action = next(steps, active, nextBtn)
                active = action.active
                stepTitle.forEach(el => {
                    el.element.classList.remove('at-active')
                    if (el.index == active) {
                        el.element.classList.add('at-active')
                    }
                })
                if (action.submit) {
                    nextBtn.disabled = true
                    atFormSend(form, 'https://eos.ct1.xyz/quad-at-form.php').then(res => {
                        active = next(steps, active, nextBtn).active
                        nextBtn.disabled = false
                        if (typeof on_result === 'function') {
                            on_result({form, btn: nextBtn, step: steps[active], result: res})
                        }
                    }).catch()
                }
            }
        })
    })
}

export {initGetEstimate}
