function validateUserDetails(phone, email, dateOfBirth, numberID) {
    // בדיקת טלפון – חייב להתחיל ב-05 ולהיות באורך 10 ספרות
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(phone)) {
        return false;
    }

    // בדיקת אימייל – חייב להסתיים ב-@mby.co.il או @gmai.com
    const emailRegex = /^[A-Z0-9._%+-]+@(mby\.co\.il|gmai\.com)$/i;
    if (!emailRegex.test(email)) {
        return false;
    }

    // אם תאריך לידה ומספר זהות לא הועברו – סיים כאן
    if (!dateOfBirth || !numberID) {
        return true;
    }

    // בדיקת תאריך – חייב להיות תאריך חוקי
    const birthDate = new Date(dateOfBirth);
    if (isNaN(birthDate)) {
        return false;
    }

    // בדיקת ת"ז – אלגוריתם תקני
    const isValidIsraeliID = (id) => {
        id = String(id).trim();
        if (id.length !== 9 || isNaN(id)) return false;
        const sum = id
            .split('')
            .map((num, i) => {
                const digit = Number(num) * ((i % 2) + 1);
                return digit > 9 ? digit - 9 : digit;
            })
            .reduce((acc, curr) => acc + curr, 0);
        return sum % 10 === 0;
    };

    if (!isValidIsraeliID(numberID)) {
        return false;
    }

    // אם הכל תקין
    return true;
}

module.exports = validateUserDetails;
