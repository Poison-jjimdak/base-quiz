
document.fonts.ready.then(() => {
    document.documentElement.classList.add("fonts-loaded");
});

/* =========================================================
   CONFIG
   ========================================================= */

const GITHUB_URL =
    "https://github.com/Poison-jjimdak/base-quiz";


/* =========================================================
   BASE SETTINGS
   ========================================================= */

let selectedFromBases = new Set([2]);
let selectedToBases = new Set([10]);


/* =========================================================
   QUIZ STATE
   ========================================================= */

let currentQuestion = null;

let totalQuestions = 0;
let correctAnswers = 0;

const history = [];


/* =========================================================
   ELEMENTS
   ========================================================= */

const questionElement =
    document.getElementById("question");

const answerInput =
    document.getElementById("answerInput");

const submitButton =
    document.getElementById("submitButton");

const resultElement =
    document.getElementById("result");

const scoreElement =
    document.getElementById("score");

const historyList =
    document.getElementById("historyList");


/* =========================================================
   BASE NAMES
   ========================================================= */

const baseNames = {
    2: "2진수",
    8: "8진수",
    10: "10진수",
    16: "16진수"
};


function formatBaseSummary(set) {

    return [...set]
        .sort((a, b) => a - b)
        .map(base => baseNames[base])
        .join(", ");
}


/* =========================================================
   RANDOM
   ========================================================= */

function randomFromSet(set) {

    const values = [...set];

    return values[
        Math.floor(Math.random() * values.length)
    ];
}


/* =========================================================
   QUESTION
   ========================================================= */

function generateQuestion() {

    const fromBase =
        randomFromSet(selectedFromBases);

    let toBase =
        randomFromSet(selectedToBases);


    // 입력/출력 진법이 같은 경우를 가능하면 피함
    if (
        selectedToBases.size > 1 &&
        fromBase === toBase
    ) {

        const candidates =
            [...selectedToBases]
                .filter(base => base !== fromBase);

        toBase =
            randomFromSet(new Set(candidates));
    }


    // 0 ~ 255
    const decimal =
        Math.floor(Math.random() * 256);


    const value =
        decimal
            .toString(fromBase)
            .toUpperCase();


    currentQuestion = {

        decimal,

        fromBase,

        toBase,

        value,

        answer:
            decimal
                .toString(toBase)
                .toUpperCase()
    };


    questionElement.innerHTML =
        `${value}<sub>${fromBase}</sub> → ?<sub>${toBase}</sub>`;


    answerInput.value = "";

    resultElement.textContent = "";
    resultElement.className = "result";

    submitButton.textContent = "제출";

    submitButton.onclick =
        submitAnswer;

    answerInput.focus();
}


/* =========================================================
   VALIDATION
   ========================================================= */

function isValidNumber(value, base) {

    if (!value) {
        return false;
    }


    const patterns = {

        2: /^[01]+$/,

        8: /^[0-7]+$/,

        10: /^\d+$/,

        16: /^[0-9a-fA-F]+$/
    };


    return patterns[base].test(value);
}


/* =========================================================
   SUBMIT
   ========================================================= */

function submitAnswer() {

    if (!currentQuestion) {
        return;
    }


    const userAnswer =
        answerInput.value
            .trim()
            .toUpperCase();


    if (
        !isValidNumber(
            userAnswer,
            currentQuestion.toBase
        )
    ) {

        resultElement.textContent =
            "올바른 형식으로 입력해주세요";

        resultElement.className =
            "result wrong";

        return;
    }


    const decimalValue =
        parseInt(
            userAnswer,
            currentQuestion.toBase
        );


    const isCorrect =
        decimalValue ===
        currentQuestion.decimal;


    totalQuestions++;


    if (isCorrect) {
        correctAnswers++;
    }


    resultElement.className =
        isCorrect
            ? "result correct"
            : "result wrong";


    resultElement.textContent =
        isCorrect
            ? "정답"
            : `오답 · 정답: ${currentQuestion.answer}`;


    history.unshift({

        question: currentQuestion,

        userAnswer,

        correct: isCorrect
    });


    if (history.length > 10) {
        history.pop();
    }


    updateScore();
    renderHistory();


    submitButton.textContent =
        "다음 문제";

    submitButton.onclick =
        generateQuestion;
}


/* =========================================================
   SCORE
   ========================================================= */

function updateScore() {

    scoreElement.textContent =
        `${correctAnswers} / ${totalQuestions}`;
}


/* =========================================================
   HISTORY
   ========================================================= */

function renderHistory() {

    historyList.innerHTML = "";


    history.forEach(item => {

        const element =
            document.createElement("div");

        element.className =
            "history-item " +
            (
                item.correct
                    ? "correct"
                    : "wrong"
            );


        const left =
            document.createElement("span");

        left.textContent =
            `${item.question.value}₍${item.question.fromBase}₎ → ` +
            `${item.question.answer}₍${item.question.toBase}₎`;


        const right =
            document.createElement("span");

        right.innerHTML =
            item.correct
                ? `<span class="material-symbols-rounded history-icon">
                     check_circle
                   </span>`
                : `<span class="material-symbols-rounded history-icon">
                     cancel
                   </span>`;


        element.append(left, right);

        historyList.appendChild(element);
    });
}


/* =========================================================
   SETTINGS
   ========================================================= */

const settingsContainer =
    document.getElementById("settingsContainer");

const settingsFab =
    document.getElementById("settingsFab");

const settingsBackdrop =
    document.getElementById("settingsBackdrop");

const settingsMain =
    document.getElementById("settingsMain");


function openSettings() {

    settingsContainer.classList.add(
        "settings-open"
    );

    showSettingsMain();
}


function closeSettings() {

    settingsContainer.classList.remove(
        "settings-open"
    );
}


settingsFab.addEventListener(
    "click",
    openSettings
);


settingsBackdrop.addEventListener(
    "click",
    closeSettings
);


/* =========================================================
   SETTINGS SCREENS
   ========================================================= */

const inputBaseScreen =
    document.getElementById("inputBaseScreen");

const outputBaseScreen =
    document.getElementById("outputBaseScreen");

const themeScreen =
    document.getElementById("themeScreen");


function hideAllScreens() {

    settingsMain.classList.add("hidden");

    inputBaseScreen.classList.remove("open");
    outputBaseScreen.classList.remove("open");
    themeScreen.classList.remove("open");
}


function showSettingsMain() {

    hideAllScreens();

    settingsMain.classList.remove("hidden");
}


/* =========================================================
   INPUT BASE
   ========================================================= */

document
    .getElementById("inputBaseSetting")
    .addEventListener("click", () => {

        hideAllScreens();

        inputBaseScreen.classList.add("open");

        updateBaseChips(
            "inputBaseChips",
            selectedFromBases
        );
    });


document
    .getElementById("inputBaseBack")
    .addEventListener(
        "click",
        showSettingsMain
    );


/* =========================================================
   OUTPUT BASE
   ========================================================= */

document
    .getElementById("outputBaseSetting")
    .addEventListener("click", () => {

        hideAllScreens();

        outputBaseScreen.classList.add("open");

        updateBaseChips(
            "outputBaseChips",
            selectedToBases
        );
    });


document
    .getElementById("outputBaseBack")
    .addEventListener(
        "click",
        showSettingsMain
    );


/* =========================================================
   BASE CHIPS
   ========================================================= */

function updateBaseChips(
    containerId,
    selectedSet
) {

    document
        .getElementById(containerId)
        .querySelectorAll("[data-base]")
        .forEach(chip => {

            const base =
                Number(chip.dataset.base);

            chip.classList.toggle(
                "selected",
                selectedSet.has(base)
            );
        });
}


/* 입력 진법 */

document
    .querySelectorAll(
        "#inputBaseChips [data-base]"
    )
    .forEach(chip => {

        chip.addEventListener(
            "click",
            () => {

                const base =
                    Number(chip.dataset.base);


                if (
                    selectedFromBases.has(base)
                ) {

                    // 하나는 반드시 남겨둠
                    if (
                        selectedFromBases.size === 1
                    ) {
                        return;
                    }

                    selectedFromBases.delete(base);

                } else {

                    selectedFromBases.add(base);
                }


                updateBaseChips(
                    "inputBaseChips",
                    selectedFromBases
                );

                updateSettingsSummary();

                generateQuestion();
            }
        );
    });


/* 출력 진법 */

document
    .querySelectorAll(
        "#outputBaseChips [data-base]"
    )
    .forEach(chip => {

        chip.addEventListener(
            "click",
            () => {

                const base =
                    Number(chip.dataset.base);


                if (
                    selectedToBases.has(base)
                ) {

                    // 하나는 반드시 남겨둠
                    if (
                        selectedToBases.size === 1
                    ) {
                        return;
                    }

                    selectedToBases.delete(base);

                } else {

                    selectedToBases.add(base);
                }


                updateBaseChips(
                    "outputBaseChips",
                    selectedToBases
                );

                updateSettingsSummary();

                generateQuestion();
            }
        );
    });


/* =========================================================
   SETTINGS SUMMARY
   ========================================================= */

function updateSettingsSummary() {

    document
        .getElementById("inputBaseSummary")
        .textContent =
            formatBaseSummary(
                selectedFromBases
            );


    document
        .getElementById("outputBaseSummary")
        .textContent =
            formatBaseSummary(
                selectedToBases
            );
}


/* =========================================================
   THEME
   ========================================================= */

const themeSetting =
    document.getElementById("themeSetting");

const themeSummary =
    document.getElementById("themeSummary");


const themeNames = {

    light: "라이트",

    dark: "다크",

    system: "기기 설정"
};


let currentTheme =
    localStorage.getItem("theme") ||
    "system";


function applyTheme(theme) {

    currentTheme = theme;


    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );


    themeSummary.textContent =
        themeNames[theme];


    document
        .querySelectorAll(
            "[data-theme-choice]"
        )
        .forEach(item => {

            item.classList.toggle(
                "selected",
                item.dataset.themeChoice === theme
            );
        });


    localStorage.setItem(
        "theme",
        theme
    );
}


/* 테마 화면 열기 */

themeSetting.addEventListener(
    "click",
    () => {

        hideAllScreens();

        themeScreen.classList.add("open");

        applyTheme(currentTheme);
    }
);


/* 테마 화면 뒤로가기 */

document
    .getElementById("themeBack")
    .addEventListener(
        "click",
        showSettingsMain
    );


/* 테마 선택 */
/*
   여기서는 showSettingsMain()을 호출하지 않음.

   그래서
   라이트 / 다크 / 기기 설정을 눌러도
   현재 테마 화면에 그대로 남아 있음.
*/

document
    .querySelectorAll(
        "[data-theme-choice]"
    )
    .forEach(item => {

        item.addEventListener(
            "click",
            () => {

                applyTheme(
                    item.dataset.themeChoice
                );

            }
        );
    });


/* =========================================================
   GITHUB
   ========================================================= */

document
    .getElementById("githubButton")
    .addEventListener(
        "click",
        () => {

            if (
                GITHUB_URL.includes(
                    "yourusername"
                )
            ) {
                return;
            }


            window.open(
                GITHUB_URL,
                "_blank",
                "noopener,noreferrer"
            );
        }
    );


/* =========================================================
   KEYBOARD
   ========================================================= */

answerInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            submitButton.click();
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeSettings();
        }
    }
);


/* =========================================================
   INITIALIZE
   ========================================================= */

updateSettingsSummary();

applyTheme(currentTheme);

generateQuestion();

