async function atFormSend(form, url) {
    let result = {success: false, message: 'Sorry, we are having technical issues. Please try again later.'}
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {"x-at-type": form.getAttribute('name')},
            body: new FormData(form)
        });
        const json = await response.json();
        console.log("Result", json);
        if (Object.prototype.hasOwnProperty.call(json, 'success')) {
            result = json
        }
        return result
    } catch (error) {
        return result
    }
}

export {atFormSend}
