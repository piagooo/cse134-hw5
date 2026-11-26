let form = document.getElementById("to-speak-or-to-die");
let nameInput = document.getElementById("user-name");
let emailInput = document.getElementById("user-email");
let messageInput = document.getElementById("user-message");
let messageAreas = document.getElementById("message-areas");
let errorArea = document.getElementById("error-area");
let infoArea = document.getElementById("info-area");
let charCount = document.getElementById("char-count");
let charWarning = document.getElementById("char-warning");
let formErrorsInput = document.getElementById("form-errors-input");

let warning_threshold = 100;

let form_errors = [];

let fields = [
    {input: nameInput, label: "Name", extraDescribedBy: []},
    {input: emailInput, label: "Email address", extraDescribedBy: []},
    {input: messageInput, label: "Message", extraDescribedBy: ["char-count"]},
];

let problems = {};
let edited = new Set();
let revealed = new Set()

let recordedAttempt = new Set();
let attemptNum = 0;
let lastRender = null;

function getProblem(input, label){
    input.setCustomValidity("");

    let v = input.validity;
    let isBlank = input.required && input.value.trim() === "";
    let problem = null;

    if (v.valueMissing || isBlank) {
        problem = {type: "missing", text: `Enter your ${label.toLowerCase()}. This field is required.` };
    }
    else if (v.typeMismatch) {
        problem = {type: "invalid-format", text: "Please enter a valid email addess. Example: name@domain.com"};
    }   
    else if (v.tooShort){
        problem = {type: "too-short", text: `${label} is too short. Please write at least ${input.minLength} characters. Lock in!!`};
    }
    else if (v.tooLong){
        problem = {type: "too-long", text: `${label} is too longggg. Please use at most ${input.maxLength} characters. Lock in less!!`};
    }
    else if (!v.valid){
        problem = {type: "other", text: input.validationMessage};
    }

    if (problem){
        input.setCustomValidity(problem.text);
    }

    return problem;

}

function checkField(field, reveal){
    problems[field.input.id] = getProblem(field.input, field.label);
    
    if (reveal){
        revealed.add(field.input.id);
    }

    render();
}


function render(){
    let visible = [];

    fields.forEach((field) => {
        let id = field.input.id;
        let problem = problems[id];
        let shown = Boolean(problem) && revealed.has(id);

        let describedBy = [`${id}-hint`, ...field.extraDescribedBy];

        if (shown){
            describedBy.push(`error-${id}`);
            field.input.setAttribute("aria-invalid", "true");

            visible.push({id, label: field.label, text: problem.text});
        } else{
            field.input.removeAttribute ("aria-invalid");
        }

        field.input.setAttribute("aria-describedby", describedBy.join(" "));
    });

    let signature = visible.map((item) => `${item.id}: ${item.text}`).join("|");

    if (signature === lastRender){
        return;
    }

    lastRender = signature;

    const heading = document.createElement("strong");
    heading.textContent = visible.length ? "Please fic the following: " : "No errors to fix.";

    errorArea.replaceChildren(heading);

    if (visible.length){
        let list = document.createElement("ul");

        visible.forEach((item) => {
            let li = document.createElement("li");

            li.id = `error-${item.id}`;
            li.textContent = `${item.label}: ${item.text}`;

            list.append(li);
        });

        errorArea.append(list);
    }
}

function recordInvalid(field){
    let id = field.input.id;

    if (recordedAttempt.size === 0){
        attemptNum++;

        setTimeout(() => recordedAttempt.clear(), 0)
    }

    checkField(field, true);
    
    let problem = problems[id];

    if (!problem || recordedAttempt.has(id)){
        return;
    }

    recordedAttempt.add(id);

    form_errors.push({
        field: field.input.name,
        error: problem.type,
        message: problem.text,
        attempt: attemptNum,
    });
}

fields.forEach((field) => {
    let input = field.input;

    input.addEventListener("input", () =>{
        edited.add(input.id);
        checkField(field, false);
    });

    input.addEventListener("blur", () =>{
        if (edited.has(input.id)){
            checkField(field, true);
        }
    });

    input.addEventListener("invalid", () => recordInvalid(field));
})

form.addEventListener("submit", () => {
    formErrorsInput.value = JSON.stringify(form_errors);
    formErrorsInput.disabled = false;
})

let lastCount = "";

function updateCount(){
    let limit = messageInput.maxLength;
    let remaining = limit - messageInput.value.length;
    
    charCount.textContent = `${remaining.toLocaleString()} of ${limit.toLocaleString()} characters remaining.`

    let state = "normal";

    if (remaining <= 0){
        state = "limit";
    } else if (remaining <= warning_threshold){
        state = "warning";
    }

    if (state !== lastCount) {
        lastCount = state;
        infoArea.dataset.state = state;

        if (state === "limit") {
            charWarning.textContent = `Limit reached: you can't add more than ${limit.toLocaleString()} characters.`;
        } else if (state === "warning") {
            charWarning.textContent = "Warning: you are approaching the character limit.";
        } else {
            charWarning.textContent = "";
        }
    }

}


messageInput.addEventListener("input", updateCount);

messageAreas.hidden = false; 

render();
updateCount();